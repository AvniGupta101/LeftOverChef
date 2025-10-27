// models/User.js
import mongoose from 'mongoose'
const { Schema } = mongoose

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  role: { type: String, enum: ['donor', 'ngo', 'admin', 'delivery'], default: 'ngo' },
  passwordHash: String,
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('User', userSchema)
