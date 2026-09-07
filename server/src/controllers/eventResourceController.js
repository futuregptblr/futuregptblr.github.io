const Event = require("../models/Event");
const EventResource = require("../models/EventResource");
const configureCloudinary = require("../lib/cloudinary");

const VALID_RESOURCE_TYPES = new Set([
  "ppt",
  "pdf",
  "doc",
  "link",
  "notes",
  "video",
  "image",
]);

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
const VALID_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const VALID_DOCUMENT_TYPES = new Set([
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);

function sanitizeUrl(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch (err) {
    return null;
  }
}

function getCloudinaryAssetReference(fileUrl) {
  try {
    const parsed = new URL(fileUrl);
    if (parsed.hostname !== "res.cloudinary.com") return null;

    const match = parsed.pathname.match(
      /\/(image|raw|video)\/upload\/(?:s--[^/]+--\/)?(?:v\d+\/)?(.+)$/,
    );
    if (!match) return null;

    return {
      resourceType: match[1],
      publicId: decodeURIComponent(match[2]),
    };
  } catch (err) {
    return null;
  }
}

function validateResourcePayload(payload) {
  if (!payload || !payload.title || !payload.type) {
    return "Title and type are required";
  }

  if (!VALID_RESOURCE_TYPES.has(payload.type)) {
    return "Invalid resource type";
  }

  if (payload.externalLink && !sanitizeUrl(payload.externalLink)) {
    return "External link must be a valid HTTPS URL";
  }

  if (payload.speaker && payload.speaker.linkedinUrl && !sanitizeUrl(payload.speaker.linkedinUrl)) {
    return "Speaker LinkedIn URL must be a valid HTTPS URL";
  }

  if (payload.type === "link" && !payload.externalLink) {
    return "External link is required for link resources";
  }

  if (payload.type !== "link" && payload.externalLink) {
    return "External link is only allowed for link resources";
  }

  return null;
}

function validateFileMetadata(file) {
  if (!file) return null;

  const mimeType = file.mimetype || file.type;
  const size = Number(file.size || 0);

  if (size <= 0) {
    return "Empty file";
  }

  if (size > MAX_FILE_SIZE_BYTES) {
    return "File exceeds 50MB maximum";
  }

  const allowed = new Set([...VALID_DOCUMENT_TYPES, ...VALID_IMAGE_TYPES]);
  if (!allowed.has(mimeType)) {
    return "Unsupported file type";
  }

  return null;
}

function isAdminUser(req) {
  return !!(req.user && req.user.email && process.env.ADMIN_EMAIL && req.user.email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase());
}

async function ensureEventOwnership(eventId, resourceId) {
  const event = await Event.findById(eventId);
  if (!event) return { event: null, resource: null };

  const resource = await EventResource.findById(resourceId);
  if (!resource) return { event, resource: null };

  const resourceBelongsToEvent = resource.eventId && resource.eventId.toString() === event._id.toString();
  return { event, resource: resourceBelongsToEvent ? resource : null };
}

async function listEventResources(req, res) {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const isAdmin = isAdminUser(req);
    if (!isAdmin && !event.published) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isPublicQuery = { eventId, isPublic: true };
    const isAuthenticatedUser = !!(req.user && req.user.sub);

    const query = isAuthenticatedUser ? { eventId } : isPublicQuery;
    const resources = await EventResource.find(query).sort({ order: 1, createdAt: -1 });

    return res.json(resources);
  } catch (err) {
    console.error("listEventResources error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getEventResource(req, res) {
  try {
    const { eventId, resourceId } = req.params;

    const resource = await EventResource.findById(resourceId);
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    if (resource.eventId.toString() !== eventId) {
      return res.status(403).json({ message: "Resource does not belong to this event" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const isAdmin = isAdminUser(req);
    if (!isAdmin && !event.published) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isAuthenticated = !!(req.user && req.user.sub);
    const isPublicResource = !!resource.isPublic;
    const requiresAuth = !!resource.requiresAuthentication;

    if (requiresAuth && !isAuthenticated && !isPublicResource) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!isPublicResource && !isAdmin && !isAuthenticated) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.json(resource);
  } catch (err) {
    console.error("getEventResource error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function createEventResource(req, res) {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const payload = { ...req.body };
    const validationError = validateResourcePayload(payload);
    if (validationError) return res.status(400).json({ message: validationError });

    if (payload.file) {
      const fileValidationError = validateFileMetadata(payload.file);
      if (fileValidationError) {
        return res.status(400).json({ message: fileValidationError });
      }
    }

    if (payload.fileUrl) {
      const cleaned = sanitizeUrl(payload.fileUrl);
      if (!cleaned) return res.status(400).json({ message: "File URL must be a valid HTTPS URL" });
      payload.fileUrl = cleaned;
    }

    const resource = await EventResource.create({
      ...payload,
      eventId,
      uploadedBy: req.user?.sub,
      isPublic: payload.isPublic !== undefined ? !!payload.isPublic : false,
      requiresAuthentication: payload.requiresAuthentication !== undefined ? !!payload.requiresAuthentication : true,
      order: payload.order ?? 0,
    });

    await Event.findByIdAndUpdate(eventId, { $addToSet: { resources: resource._id } });
    return res.status(201).json(resource);
  } catch (err) {
    console.error("createEventResource error", err);
    return res.status(400).json({ message: "Invalid data" });
  }
}

async function updateEventResource(req, res) {
  try {
    const { eventId, resourceId } = req.params;
    const { eventId: ignoredEventId, uploadedBy, ...updateData } = req.body || {};

    const result = await ensureEventOwnership(eventId, resourceId);
    if (!result.event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (!result.resource) {
      return res.status(403).json({ message: "Resource does not belong to this event" });
    }

    const validationError = validateResourcePayload({
      title: updateData.title ?? result.resource.title,
      type: updateData.type ?? result.resource.type,
      externalLink: updateData.externalLink ?? result.resource.externalLink,
      speaker: updateData.speaker ?? result.resource.speaker,
      isPublic: updateData.isPublic ?? result.resource.isPublic,
      requiresAuthentication: updateData.requiresAuthentication ?? result.resource.requiresAuthentication,
    });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    if (updateData.fileUrl) {
      const cleaned = sanitizeUrl(updateData.fileUrl);
      if (!cleaned) {
        return res.status(400).json({ message: "File URL must be a valid HTTPS URL" });
      }
      updateData.fileUrl = cleaned;
    }

    const updated = await EventResource.findByIdAndUpdate(resourceId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Resource not found" });
    }

    return res.json(updated);
  } catch (err) {
    console.error("updateEventResource error", err);
    return res.status(400).json({ message: "Invalid data" });
  }
}

async function deleteEventResource(req, res) {
  try {
    const { eventId, resourceId } = req.params;
    const result = await ensureEventOwnership(eventId, resourceId);
    if (!result.event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (!result.resource) {
      return res.status(403).json({ message: "Resource does not belong to this event" });
    }

    await EventResource.findByIdAndDelete(resourceId);
    await Event.findByIdAndUpdate(eventId, { $pull: { resources: resourceId } });

    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteEventResource error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function downloadEventResource(req, res) {
  try {
    const { eventId, resourceId } = req.params;

    const resource = await EventResource.findById(resourceId);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    if (resource.eventId.toString() !== eventId) {
      return res.status(403).json({ message: "Resource does not belong to this event" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const isAdmin = isAdminUser(req);
    if (!isAdmin && !event.published) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isAuthenticated = !!(req.user && req.user.sub);
    const isPublicResource = !!resource.isPublic;

    if ((resource.requiresAuthentication || !isPublicResource) && !isAuthenticated && !isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (resource.externalLink) {
      return res.redirect(resource.externalLink);
    }

    if (!resource.fileUrl) {
      return res.status(404).json({ message: "No file for this resource" });
    }

    const asset = getCloudinaryAssetReference(resource.fileUrl);
    if (!asset) {
      return res.status(400).json({ message: "Unsupported resource storage URL" });
    }

    const cloudinary = configureCloudinary();
    const signedUrl = cloudinary.url(asset.publicId, {
      secure: true,
      resource_type: asset.resourceType,
      type: "upload",
      sign_url: true,
      expires_at: Math.round(Date.now() / 1000) + 300,
    });

    return res.redirect(signedUrl);
  } catch (err) {
    console.error("downloadEventResource error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  listEventResources,
  getEventResource,
  createEventResource,
  updateEventResource,
  deleteEventResource,
  downloadEventResource,
};
