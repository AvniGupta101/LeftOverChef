// models/Listing.js
import mongoose from 'mongoose'
const { Schema } = mongoose

const imageSchema = new Schema({
  url: String,
  public_id: String
}, { _id: false })

const listingSchema = new Schema({
  donorId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  title: { type: String, required: true },
  description: String,
  quantity: Number,
  pickup_address: String,
  pickup_lat: Number,
  pickup_lng: Number,
  images: [imageSchema],
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'claimed', 'completed', 'expired','fulfilled'], default: 'pending' },
  expires_at: Date,
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

listingSchema.pre('save', function (next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.model('Listing', listingSchema)
