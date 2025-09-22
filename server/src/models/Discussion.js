const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    authorName: { type: String, trim: true },
    category: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    replies: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    isPinned: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: [
      {
        authorName: { type: String, trim: true },
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Discussion', discussionSchema);


