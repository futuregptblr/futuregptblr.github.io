const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    isPremium: { type: Boolean, default: false },
    premiumPurchaseDate: { type: Date },
    paymentId: { type: String },
    orderId: { type: String },
    // Additional profile fields
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    role: { type: String, trim: true },
    company: { type: String, trim: true },
    bio: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    interests: [{ type: String, trim: true }],
    resumeUrl: { type: String, trim: true },
    avatar: { type: String, default: '👨‍💻' },
    joinDate: { type: Date, default: Date.now },
    // Privacy settings
    profileVisibility: { type: String, enum: ['public', 'members', 'private'], default: 'public' },
    showOnlineStatus: { type: Boolean, default: true },
    allowDirectMessages: { type: Boolean, default: true },
    // Notification preferences
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    eventReminders: { type: Boolean, default: true },
    jobAlerts: { type: Boolean, default: false }
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
