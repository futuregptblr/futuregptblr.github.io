const express = require("express");
const auth = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");
const {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  listMyRegistrations,
  adminListRegistrations,
  updateRegistrationStatus,
} = require("../controllers/eventController");
const {
  listEventResources,
  getEventResource,
  createEventResource,
  updateEventResource,
  deleteEventResource,
  downloadEventResource,
} = require("../controllers/eventResourceController");

const router = express.Router();

function optionalAuth(req, res, next) {
  if (!req.headers.authorization) return next();
  return auth(req, res, next);
}

// Public
router.get("/", optionalAuth, listEvents);

// Specific routes before parameterized routes
router.get("/me/registrations", auth, listMyRegistrations);
router.get("/:eventId/resources", listEventResources);
router.get("/:eventId/resources/:resourceId", getEventResource);
router.get("/:eventId/resources/:resourceId/download", auth, downloadEventResource);
router.get("/:id", getEvent);

// Authenticated user
router.post("/:id/register", auth, registerForEvent);

// Admin
router.post("/", auth, requireAdmin, createEvent);
router.post("/:eventId/resources", auth, requireAdmin, createEventResource);
router.put("/:id", auth, requireAdmin, updateEvent);
router.put("/:eventId/resources/:resourceId", auth, requireAdmin, updateEventResource);
router.delete("/:id", auth, requireAdmin, deleteEvent);
router.delete("/:eventId/resources/:resourceId", auth, requireAdmin, deleteEventResource);
router.get("/:id/registrations", auth, requireAdmin, adminListRegistrations);
router.put(
  "/registrations/:id/status",
  auth,
  requireAdmin,
  updateRegistrationStatus,
);

module.exports = router;
