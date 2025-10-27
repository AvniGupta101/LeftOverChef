// models/Claim.js
import mongoose from 'mongoose'
const { Schema } = mongoose

const claimSchema = new Schema({
  listingId: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
  ngoId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['requested', 'confirmed', 'picked_up', 'delivered', 'cancelled','fulfilled'], default: 'requested' },
  contactInfo: Schema.Types.Mixed,
  message: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

claimSchema.pre('save', function (next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.model('Claim', claimSchema)
