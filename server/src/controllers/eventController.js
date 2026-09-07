const Event = require("../models/Event");
const EventRegistration = require("../models/EventRegistration");

async function ensureSingleFeaturedEvent(eventId) {
  const updates = { $set: { isFeatured: false } };
  if (eventId) {
    await Event.updateMany({ _id: { $ne: eventId }, isFeatured: true }, updates);
    return;
  }
  await Event.updateMany({ isFeatured: true }, updates);
}

async function listEvents(req, res) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { scope = "upcoming", kind = "normal" } = req.query;
    const query = {};
    const isAdminRequest = !!(
      req.user &&
      req.user.email &&
      process.env.ADMIN_EMAIL &&
      req.user.email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()
    );

    if (!isAdminRequest) {
      query.published = true;
    }

    query.isMonthlyEvent = kind === "monthly" ? true : { $ne: true };

    if (scope === "upcoming") {
      query.date = { $gte: today };
    } else if (scope === "past") {
      query.date = { $lt: today };
    }

    const events = await Event.find(query).populate("resources").sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error("listEvents error", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getEvent(req, res) {
  try {
    const event = await Event.findById(req.params.id).populate("resources");
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.isMonthlyEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isAdminRequest = !!(
      req.user &&
      req.user.email &&
      process.env.ADMIN_EMAIL &&
      req.user.email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()
    );

    if (!isAdminRequest && !event.published) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    console.error("getEvent error", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function createEvent(req, res) {
  try {
    const eventPayload = { ...req.body, createdBy: req.user?.sub };

    if (eventPayload.isFeatured === true) {
      await ensureSingleFeaturedEvent(eventPayload._id || null);
    }

    const created = await Event.create(eventPayload);
    res.status(201).json(created);
  } catch (err) {
    console.error("createEvent error", err);
    res.status(400).json({ message: "Invalid data" });
  }
}

async function updateEvent(req, res) {
  try {
    const eventPayload = { ...req.body };

    if (eventPayload.isFeatured === true) {
      await ensureSingleFeaturedEvent(req.params.id);
    }

    const updated = await Event.findByIdAndUpdate(req.params.id, eventPayload, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Event not found" });
    res.json(updated);
  } catch (err) {
    console.error("updateEvent error", err);
    res.status(400).json({ message: "Invalid data" });
  }
}

async function deleteEvent(req, res) {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Event not found" });
    await EventRegistration.deleteMany({ eventId: deleted._id });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteEvent error", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function registerForEvent(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.isMonthlyEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    const registration = await EventRegistration.create({
      eventId: id,
      userId,
      userName: req.user?.name || undefined,
      userEmail: req.user?.email || undefined,
      status: "pending",
    });

    res.status(201).json(registration);
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Already registered" });
    }
    console.error("registerForEvent error", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateRegistrationStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (
      ![
        "pending",
        "approved",
        "rejected",
        "registered",
        "waitlisted",
        "cancelled",
      ].includes(status)
    ) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const registration = await EventRegistration.findById(id);
    if (!registration)
      return res.status(404).json({ message: "Registration not found" });

    const oldStatus = registration.status;
    registration.status = status;
    await registration.save();

    if (status === "approved" || status === "registered") {
      if (oldStatus !== "approved" && oldStatus !== "registered") {
        await Event.findByIdAndUpdate(registration.eventId, {
          $inc: { registrationsCount: 1 },
        });
      }
    } else if (oldStatus === "approved" || oldStatus === "registered") {
      await Event.findByIdAndUpdate(registration.eventId, {
        $inc: { registrationsCount: -1 },
      });
    }

    res.json(registration);
  } catch (err) {
    console.error("updateRegistrationStatus error", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function listMyRegistrations(req, res) {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const regs = await EventRegistration.find({ userId }).populate("eventId");
    res.json(regs);
  } catch (err) {
    console.error("listMyRegistrations error", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function adminListRegistrations(req, res) {
  try {
    const regs = await EventRegistration.find({
      eventId: req.params.id,
    }).populate(
      "userId",
      "name email role company bio skills interests avatar experience location phone resumeUrl createdAt",
    );
    res.json(regs);
  } catch (err) {
    console.error("adminListRegistrations error", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  listMyRegistrations,
  adminListRegistrations,
  updateRegistrationStatus,
  ensureSingleFeaturedEvent,
};
