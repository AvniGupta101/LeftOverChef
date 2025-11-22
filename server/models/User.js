// // models/User.js
// import mongoose from 'mongoose'
// const { Schema } = mongoose

// const userSchema = new Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phone: String,
//   role: { type: String, enum: ['donor', 'ngo', 'admin', 'delivery'], default: 'ngo' },
//   passwordHash: String,
//   createdAt: { type: Date, default: Date.now }
// })

// export default mongoose.model('User', userSchema)
// models/User.js
import mongoose from 'mongoose'
const { Schema } = mongoose

/**
 * Kept all original fields (name, email, phone, role, passwordHash, createdAt)
 * Added optional fields used by the app:
 *  - pushToken (for notifications)
 *  - lastActiveAt
 *  - appPreferences (flexible JSON)
 *
 * Default role preserved to avoid breaking website logic.
 */
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  role: { type: String, enum: ['donor', 'ngo', 'admin', 'delivery'], default: 'ngo' },
  passwordHash: String,
  // app fields (optional)
  pushToken: { type: String },             // device push token for notifications (optional)
  lastActiveAt: { type: Date },
  appPreferences: { type: Schema.Types.Mixed }, // optional JSON for app UX preferences
  createdAt: { type: Date, default: Date.now }
})

userSchema.index({ role: 1 });
export default mongoose.model('User', userSchema)
