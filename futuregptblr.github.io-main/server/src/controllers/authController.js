const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { transporter } = require("../lib/mailer");

function createToken(user) {
  const payload = { sub: user._id, email: user.email, name: user.name };
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: "7d" };
  return jwt.sign(payload, secret, options);
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    // Password policy: min 8 chars, upper, lower, digit, special
    const passwordPolicy = {
      minLength: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      digit: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
    if (
      !passwordPolicy.minLength ||
      !passwordPolicy.upper ||
      !passwordPolicy.lower ||
      !passwordPolicy.digit ||
      !passwordPolicy.special
    ) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include upper, lower, number, and special character",
      });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }
    const hashedPassword = await User.hashPassword(password);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = createToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = createToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: "Email is required" });
    const user = await User.findOne({ email: email.toLowerCase() });
    // For privacy, always respond success
    if (!user)
      return res.json({
        message: "A reset link has been sent to your email.",
      });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    const appBaseUrl = process.env.APP_BASE_URL || "http://localhost:5173";
    const resetUrl = `${appBaseUrl}/reset-password?token=${token}&email=${encodeURIComponent(
      user.email
    )}`;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Reset your FutureGPT password",
      html: `<p>Hello ${user.name || ""},</p>
<p>You requested to reset your password. Click the link below to set a new password. This link expires in 30 minutes.</p>
<p><a href="${resetUrl}">Reset Password</a></p>
<p>If you didn't request this, you can safely ignore this email.</p>`,
    });

    return res.json({
      message: "A reset link has been sent to your email.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, email, password } = req.body || {};
    if (!token || !email || !password) {
      return res
        .status(400)
        .json({ message: "Token, email and new password are required" });
    }

    // Password policy: min 8 chars, upper, lower, digit, special
    const passwordPolicy = {
      minLength: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      digit: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
    if (
      !passwordPolicy.minLength ||
      !passwordPolicy.upper ||
      !passwordPolicy.lower ||
      !passwordPolicy.digit ||
      !passwordPolicy.special
    ) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include upper, lower, number, and special character",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    const hashed = await User.hashPassword(password);
    user.password = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
