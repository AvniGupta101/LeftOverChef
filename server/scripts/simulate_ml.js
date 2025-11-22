// scripts/simulate_ml.js
import mongoose from 'mongoose';
import Listing from '../models/Listing.js';
import MlLog from '../models/MlLog.js';

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('Set MONGO_URI before running: $env:MONGO_URI="..."');
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Usage: node scripts/simulate_ml.js <LISTING_ID>');
  process.exit(1);
}
const listingId = args[0];

async function run() {
  await mongoose.connect(uri);
  console.log('Connected');

  const listing = await Listing.findById(listingId);
  if (!listing) {
    console.error('Listing not found:', listingId);
    await mongoose.disconnect();
    process.exit(2);
  }

  // simulate ML result
  const prediction = 'fresh';
  const confidence = 0.94;
  const modelVersion = 'v1-sim';

  listing.mlPrediction = prediction;
  listing.mlConfidence = confidence;
  listing.mlModelVersion = modelVersion;
  listing.mlProcessedAt = new Date();
  listing.status = 'fresh';
  await listing.save();

  await MlLog.create({
    listingId: listing._id,
    imageUrl: (listing.images?.[0]?.url) || '',
    prediction,
    confidence,
    rawOutput: { simulated: true },
    modelVersion
  });

  console.log('ML update applied to listing', listingId);
  await mongoose.disconnect();
  console.log('Disconnected');
}

run().catch(err => { console.error(err); process.exit(1) });
