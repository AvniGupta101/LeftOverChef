// models/RecommendationHistory.js
import mongoose from 'mongoose'
const { Schema } = mongoose

const RecSchema = new Schema({
  donorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  ngoId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  successfulMatches: { type: Number, default: 0 }, // accepted exchanges
  totalRequests: { type: Number, default: 0 },     // total requests (accepted+rejected)
  preferenceScore: { type: Number, default: 0.0 }, // 0..1 score (updated by simple rule or ML)
  lastInteraction: { type: Date }
}, { timestamps: true });

RecSchema.index({ donorId: 1, ngoId: 1 }, { unique: true });
RecSchema.index({ donorId: 1, preferenceScore: -1 });

export default mongoose.model('RecommendationHistory', RecSchema);
