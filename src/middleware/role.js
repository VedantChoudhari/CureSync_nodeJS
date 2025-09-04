module.exports = function(allowedRoles = []) {
  return (req, res, next) => {
    const user = req.user; // from auth middleware
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient privileges' });
    }

    next();
  };
};
