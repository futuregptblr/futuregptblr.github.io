const mongoose = require("mongoose");

const eventResourceSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    type: {
      type: String,
      enum: ["ppt", "pdf", "doc", "link", "notes", "video", "image"],
      required: true,
    },
    fileUrl: { type: String, trim: true },
    externalLink: { type: String, trim: true },
    speaker: {
      name: { type: String, trim: true },
      title: { type: String, trim: true },
      linkedinUrl: { type: String, trim: true },
    },
    isPublic: { type: Boolean, default: false },
    requiresAuthentication: { type: Boolean, default: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

eventResourceSchema.index({ eventId: 1, order: 1 });

module.exports = mongoose.model("EventResource", eventResourceSchema);
