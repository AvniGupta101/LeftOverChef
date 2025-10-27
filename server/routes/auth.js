// routes/auth.js
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import dotenv from 'dotenv'
dotenv.config()

const router = express.Router()

// Register (simple)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'ngo', phone } = req.body
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ error: 'Email already used' })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, role, phone, passwordHash })
    return res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' })
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
    return res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
