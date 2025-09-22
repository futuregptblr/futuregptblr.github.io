const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    date: { type: Date, required: true },
    startTime: { type: String, trim: true },
    endTime: { type: String, trim: true },
    location: { type: String, required: true, trim: true },
    chapter: { type: String, trim: true },
    type: { type: String, enum: ['Conference', 'Workshop', 'Networking', 'Career Fair', 'Webinar', 'Meetup'], default: 'Meetup' },
    capacity: { type: Number, default: 0 },
    isPremium: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
    image: { type: String, trim: true },
    speakers: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    published: { type: Boolean, default: true },
    registrationsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

eventSchema.index({ date: 1, published: 1 });

module.exports = mongoose.model('Event', eventSchema);


