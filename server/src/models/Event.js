const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    date: {
      type: Date,
      required: function () {
        return !this.isMonthlyEvent;
      },
    },
    startTime: { type: String, trim: true },
    endTime: { type: String, trim: true },
    location: {
      type: String,
      required: function () {
        return !this.isMonthlyEvent;
      },
      trim: true,
    },
    locationUrl: { type: String, trim: true },
    lumaUrl: { type: String, trim: true },
    meetupUrl: { type: String, trim: true },
    registrationUrl: { type: String, trim: true },
    chapter: { type: String, trim: true },
    domain: { type: String, trim: true },
    type: {
      type: String,
      enum: [
        "Conference",
        "Workshop",
        "Networking",
        "Career Fair",
        "Webinar",
        "Meetup",
      ],
      default: "Meetup",
    },
    capacity: { type: Number, default: 0 },
    isPremium: { type: Boolean, default: false },
    isMonthlyEvent: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
    image: { type: String, trim: true },
    speaker: {
      name: { type: String, trim: true },
      title: { type: String, trim: true },
      company: { type: String, trim: true },
      linkedinUrl: { type: String, trim: true },
      profileImage: { type: String, trim: true },
    },
    speakers: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    published: { type: Boolean, default: true },
    registrationsCount: { type: Number, default: 0 },
    resources: [{ type: mongoose.Schema.Types.ObjectId, ref: "EventResource" }],
  },
  { timestamps: true },
);

eventSchema.index({ date: 1, published: 1 });
eventSchema.index({ isFeatured: 1, published: 1 });

module.exports = mongoose.model("Event", eventSchema);
