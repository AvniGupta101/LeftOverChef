// server.js
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import path from 'path'

import authRoutes from './routes/auth.js'
import listingRoutes from './routes/listings.js'
import claimRoutes from './routes/claims.js'
import {requireAuth} from './middleware/requireAuth.js'
import uploadRoutes from "./routes/uploadRoutes.js";




dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000
// const usersRouter = require('./routes/users');
// Middleware

app.use(cors())

// server.js (or wherever you configure express)
app.use(express.json({ limit: "12mb" }));
app.use(express.urlencoded({ limit: "12mb", extended: true }));
 // for form bodies

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log('MongoDB connected')
  } catch (err) {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  }
}
connectDB()

// Base routes
app.get('/', (req, res) => res.json({ ok: true, msg: 'LeftoverChef API' }))

app.use('/api/auth', authRoutes)
app.use('/api/listings', listingRoutes)
app.use('/api/claims', requireAuth ,claimRoutes)
app.use("/api/upload", uploadRoutes);

// app.use('/api/users', usersRouter);
// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Server error', details: err.message })
})


app.listen(PORT, '0.0.0.0', () =>
  console.log(`Server running on http://0.0.0.0:${PORT}`)
);
