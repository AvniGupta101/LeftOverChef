// server/routes/auth.js
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import dotenv from 'dotenv'
dotenv.config()

const router = express.Router()

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'donor', phone } = req.body

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }

    // Validate role
    if (!['donor', 'ngo', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' })
    }

    // Check if user already exists
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({ 
      name, 
      email, 
      role, 
      phone, 
      passwordHash 
    })

    return res.status(201).json({ 
      message: 'User registered successfully',
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    })
  } catch (err) {
    console.error('Registration error:', err)
    return res.status(500).json({ error: err.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role, 
        email: user.email,
        name: user.name
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    )

    return res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      } 
    })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ error: err.message })
  }
})

export default router