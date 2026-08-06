const mongoose = require("mongoose");

const eventRegistrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: { type: String, trim: true },
    userEmail: { type: String, trim: true },
    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "registered",
        "waitlisted",
        "cancelled",
      ],
      default: "pending",
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

eventRegistrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("EventRegistration", eventRegistrationSchema);
