const jwt = require("jsonwebtoken");
const env = require("../config/env");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      name: payload.name || ""
    };
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return next();
  };
}

module.exports = {
  requireAuth,
  requireRole
};
