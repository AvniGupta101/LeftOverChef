// server/middleware/requireAuth.js
import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Normalize common id fields into req.user.id
    const id = decoded.id || decoded._id || decoded.userId || decoded.sub;
    req.user = {
      id,
      role: decoded.role,
      name: decoded.name,
      email: decoded.email,
      raw: decoded, // keep full decoded for debugging if needed
    };

    return next();
  } catch (err) {
    console.error("requireAuth token verify error:", err.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}
