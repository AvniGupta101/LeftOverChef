// // models/Listing.js
// import mongoose from 'mongoose'
// const { Schema } = mongoose

// const imageSchema = new Schema({
//   url: String,
//   public_id: String
// }, { _id: false })

// const listingSchema = new Schema({
//   donorId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
//   title: { type: String, required: true },
//   description: String,
//   // Use Schema.Types.Mixed to accept both string and number
//   quantity: Schema.Types.Mixed,
//   pickup_address: String,
//   pickup_lat: Number,
//   pickup_lng: Number,
//   images: [imageSchema],
//   status: { type: String, enum: ['pending', 'approved', 'rejected', 'claimed', 'completed', 'expired','fulfilled'], default: 'pending' },
//   expires_at: Date,
//   tags: [String],
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// })

// listingSchema.pre('save', function (next) {
//   this.updatedAt = new Date()
  
//   // Auto-convert quantity to number if it's a string
//   if (this.quantity && typeof this.quantity === 'string') {
//     const numericStr = this.quantity.replace(/[^\d.]/g, '');
//     const parsed = parseFloat(numericStr);
//     if (Number.isFinite(parsed)) {
//       this.quantity = parsed;
//     }
//   }
  
//   next()
// })

// export default mongoose.model('Listing', listingSchema)
// models/Listing.js
import mongoose from 'mongoose'
const { Schema } = mongoose

const imageSchema = new Schema({
  url: String,
  public_id: String
}, { _id: false })

/**
 * Extended Listing model to support:
 *  - app uploads (imageUrl already present in images[])
 *  - ML result fields (mlPrediction, mlConfidence, mlModelVersion, mlProcessedAt)
 *  - app flow statuses (processing, fresh, stale, accepted)
 *  - image metadata (imageMeta)
 *
 * NOTE: existing fields and pre('save') numeric-conversion logic are kept unchanged
 * to preserve website behaviour. New fields are optional.
 */
const listingSchema = new Schema({
  donorId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  title: { type: String, required: true },
  description: String,
  // Use Schema.Types.Mixed to accept both string and number
  quantity: Schema.Types.Mixed,
  pickup_address: String,
  pickup_lat: Number,
  pickup_lng: Number,
  images: [imageSchema],           // existing site expects images[]
  // optional image metadata for app/ML
  imageMeta: {
    width: Number,
    height: Number,
    format: String,
    sizeBytes: Number,
    exif: Schema.Types.Mixed
  },
  /**
   * Keep all previous status values and add new ones required by app/ML.
   * This keeps the website queries (which may filter by 'pending' / 'approved' etc.)
   * working while allowing app logic to use fresh/stale/processing.
   */
  status: { type: String, enum: [
    'pending', 'approved', 'rejected', 'claimed', 'completed', 'expired', 'fulfilled',
    /* app/ML statuses: */ 'processing', 'fresh', 'stale', 'accepted'
  ], default: 'pending' },

  // ML fields (optional) - updated by ML worker/webhook
  mlPrediction: { type: String, enum: ['unknown','fresh','stale','unsure'], default: 'unknown' },
  mlConfidence: { type: Number },    // 0..1
  mlModelVersion: { type: String },
  mlProcessedAt: { type: Date },

  // who accepted the listing (if any) — website uses Claim; this is optional denormalized pointer
  acceptedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },

  // optional expiry window (keeps original 'expires_at' name)
  expires_at: Date,
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

listingSchema.pre('save', function (next) {
  this.updatedAt = new Date()

  // Auto-convert quantity to number if it's a string (existing website behavior preserved)
  if (this.quantity && typeof this.quantity === 'string') {
    const numericStr = this.quantity.replace(/[^\d.]/g, '');
    const parsed = parseFloat(numericStr);
    if (Number.isFinite(parsed)) {
      this.quantity = parsed;
    }
  }

  next()
})

// keep indexes that help both website and app queries
listingSchema.index({ donorId: 1 });
listingSchema.index({ status: 1, mlPrediction: 1, createdAt: -1 });

export default mongoose.model('Listing', listingSchema)
