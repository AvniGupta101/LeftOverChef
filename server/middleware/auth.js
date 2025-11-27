// server/middleware/auth.js
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

/**
 * Middleware to require authentication
 * Verifies JWT token and attaches user info to req.user
 */
export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Attach user info to request
    req.user = {
      id: decoded.id || decoded._id,
      role: decoded.role,
      name: decoded.name,
      email: decoded.email
    }

    next()
  } catch (err) {
    console.error('Auth middleware error:', err.message)
    return res.status(403).json({ error: 'Invalid or expired token' })
  }
}

/**
 * Middleware to require specific roles
 * @param {Array<string>} roles - Array of allowed roles
 */
export const permit = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }

    next()
  }
}

export default { requireAuth, permit }