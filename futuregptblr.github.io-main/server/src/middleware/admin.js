function requireAdmin(req, res, next) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const isAdmin = req.user && req.user.email && adminEmail && req.user.email.toLowerCase() === adminEmail.toLowerCase();
  if (!isAdmin) return res.status(403).json({ message: 'Forbidden' });
  return next();
}

module.exports = requireAdmin;


