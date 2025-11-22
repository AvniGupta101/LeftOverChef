// models/MlLog.js
import mongoose from 'mongoose'
const { Schema } = mongoose

const MlLogSchema = new Schema({
  listingId: { type: Schema.Types.ObjectId, ref: 'Listing' },
  imageUrl: { type: String },
  prediction: { type: String },   // e.g. 'fresh' / 'stale' / 'unsure'
  confidence: { type: Number },   // 0..1
  rawOutput: Schema.Types.Mixed,  // raw model output / probabilities
  modelVersion: { type: String },
  createdAt: { type: Date, default: Date.now }
})

MlLogSchema.index({ listingId: 1 });
export default mongoose.model('MlLog', MlLogSchema);
