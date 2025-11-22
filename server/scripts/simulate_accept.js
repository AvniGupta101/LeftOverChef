// scripts/simulate_accept.js
import mongoose from 'mongoose';
import Listing from '../models/Listing.js';
import Claim from '../models/Claim.js';
import RecommendationHistory from '../models/RecommendationHistory.js';

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('Set MONGO_URI environment variable first');
  process.exit(1);
}

// args: listingId ngoId
const [listingId, ngoId] = process.argv.slice(2);
if (!listingId || !ngoId) {
  console.error('Usage: node scripts/simulate_accept.js <LISTING_ID> <NGO_ID>');
  process.exit(1);
}

async function run() {
  await mongoose.connect(uri);
  console.log('Connected');

  const listing = await Listing.findById(listingId);
  if (!listing) {
    console.error('Listing not found');
    await mongoose.disconnect();
    process.exit(2);
  }

  // Create Claim (NGO requests listing) — DO NOT set invalid status value
  // either omit `status` (so schema default 'requested' is used) or set to 'requested'
  const claim = await Claim.create({
    listingId: listing._id,
    ngoId,
    // status: 'requested', // optional, schema default will be used if omitted
    createdAt: new Date(),
    updatedAt: new Date()
  });

  console.log('Created claim:', claim._id.toString());

  // Accept the claim (simulate donor acceptance)
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Claim.updateOne(
      { _id: claim._id },
      { $set: { status: 'confirmed', updatedAt: new Date() } }, // use an allowed enum value for accepted state
      { session }
    );

    await Listing.updateOne(
      { _id: listing._id },
      { $set: { isAccepted: true, acceptedBy: ngoId, status: 'accepted' } },
      { session }
    );

    // Update recommendation history
    await RecommendationHistory.updateOne(
      { donorId: listing.donorId, ngoId },
      {
        $inc: { successfulMatches: 1, totalRequests: 1 },
        $set: { lastInteraction: new Date() }
      },
      { upsert: true, session }
    );

    await session.commitTransaction();
    console.log('Claim accepted + Recommendation updated.');
  } catch (err) {
    await session.abortTransaction();
    console.error('Transaction failed:', err);
  } finally {
    session.endSession();
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

run().catch(err => console.error(err));
