// server/models/Listing.js
import mongoose from 'mongoose'
const { Schema } = mongoose

const listingSchema = new Schema({
  donorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'servings' },
  pickupAddress: String,
  pickupTime: Date,
  perishabilityHours: Number,
  imageUrl: String, // Cloudinary URL
  status: { 
    type: String, 
    enum: ['available', 'claimed', 'picked', 'expired'], 
    default: 'available' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

listingSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.model('Listing', listingSchema)