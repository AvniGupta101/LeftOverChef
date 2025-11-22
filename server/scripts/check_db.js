// scripts/check_db.js
import mongoose from 'mongoose';
import Listing from '../models/Listing.js';
import User from '../models/User.js';
import RecommendationHistory from '../models/RecommendationHistory.js';
import MlLog from '../models/MlLog.js';

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('Set MONGO_URI before running: $env:MONGO_URI="..."');
  process.exit(1);
}

async function run() {
  await mongoose.connect(uri);
  console.log('Connected');

  const listingsCount = await Listing.countDocuments();
  const sampleListing = await Listing.findOne().lean();
  const usersCount = await User.countDocuments();
  const recCount = await RecommendationHistory.countDocuments();
  const mllogCount = await MlLog.countDocuments();

  console.log('counts => listings:', listingsCount, 'users:', usersCount, 'recommendation_history:', recCount, 'mllogs:', mllogCount);
  console.log('sample listing (first):', sampleListing);

  await mongoose.disconnect();
  console.log('Disconnected');
}
run().catch(err => { console.error(err); process.exit(1) });
