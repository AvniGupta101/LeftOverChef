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
  // Use Schema.Types.Mixed to accept both string and number
  quantity: Schema.Types.Mixed,
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
  
  // Auto-convert quantity to number if it's a string
  if (this.quantity && typeof this.quantity === 'string') {
    const numericStr = this.quantity.replace(/[^\d.]/g, '');
    const parsed = parseFloat(numericStr);
    if (Number.isFinite(parsed)) {
      this.quantity = parsed;
    }
  }
  
  next()
})

export default mongoose.model('Listing', listingSchema)