// middleware/auth.js
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const requireAuth = (req, res, next) => {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'No authorization header' })
  const token = auth.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export const requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' })
  if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' })
  next()
}
