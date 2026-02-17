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
  adminListAllEvents,
  updateRegistrationStatus,
} = require("../controllers/eventController");

const router = express.Router();

// Public
// Public
router.get("/", listEvents);

// Specific routes before parameterized routes
router.get("/me/registrations", auth, listMyRegistrations);
router.get("/admin/all", auth, requireAdmin, adminListAllEvents);

router.get("/:id", getEvent);

// Authenticated user
router.post("/:id/register", auth, registerForEvent);

// Admin
router.post("/", auth, requireAdmin, createEvent);
router.put("/:id", auth, requireAdmin, updateEvent);
router.delete("/:id", auth, requireAdmin, deleteEvent);
router.get("/:id/registrations", auth, requireAdmin, adminListRegistrations);
router.put(
  "/registrations/:id/status",
  auth,
  requireAdmin,
  updateRegistrationStatus,
);

module.exports = router;
