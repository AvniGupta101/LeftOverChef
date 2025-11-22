// scripts/migrate_db.js
// ESM version — run with: node .\scripts\migrate_db.js
import mongoose from 'mongoose'
import Listing from '../models/Listing.js'
import User from '../models/User.js'
import Claim from '../models/Claim.js'
import RecommendationHistory from '../models/RecommendationHistory.js'
import MlLog from '../models/MlLog.js'

const MONGO_URI = process.env.MONGO_URI
if (!MONGO_URI) {
  console.error('ERROR: Please set the MONGO_URI environment variable before running this script.')
  process.exit(1)
}

async function upsertDefaults() {
  console.log('Step 1: Ensure Listing docs have ML fields and status defaults')

  // Set default mlPrediction & status if missing
  await Listing.updateMany(
    { $or: [{ mlPrediction: { $exists: false } }, { status: { $exists: false } }] },
    { $set: { mlPrediction: 'unknown', status: 'pending' } }
  )

  console.log('Step 2: Ensure User docs have role (if missing)')
  await User.updateMany(
    { role: { $exists: false } },
    { $set: { role: 'donor' } }
  )

  console.log('Step 3: Create indexes for new models (if not present)')
  try {
    await RecommendationHistory.createIndexes()
    await MlLog.createIndexes()
    await Listing.createIndexes()
    console.log('Indexes created/ensured.')
  } catch (err) {
    console.warn('Index creation warning:', err.message || err)
  }

  console.log('Step 4: Seed RecommendationHistory from accepted Claims (if any)')
  // Define which claim statuses we treat as successful/accepted matches.
  const acceptedStatuses = ['confirmed','picked_up','delivered','fulfilled','accepted']

  // Aggregate accepted claims and group by donorId (via Listing) and ngoId
  const pipeline = [
    { $match: { status: { $in: acceptedStatuses } } },
    {
      $lookup: {
        from: 'listings',
        localField: 'listingId',
        foreignField: '_id',
        as: 'listing'
      }
    },
    { $unwind: '$listing' },
    {
      $group: {
        _id: { donorId: '$listing.donorId', ngoId: '$ngoId' },
        count: { $sum: 1 },
        lastInteraction: { $max: '$updatedAt' }
      }
    }
  ]

  const agg = await Claim.aggregate(pipeline).allowDiskUse(true)
  for (const row of agg) {
    const donorId = row._id.donorId
    const ngoId = row._id.ngoId
    if (!donorId || !ngoId) continue

    await RecommendationHistory.updateOne(
      { donorId, ngoId },
      {
        $inc: { successfulMatches: row.count, totalRequests: row.count },
        $set: { lastInteraction: row.lastInteraction || new Date() }
      },
      { upsert: true }
    )
  }

  console.log('Seeding of RecommendationHistory (if any) finished.')
}

async function main() {
  console.log('Connecting to MongoDB...')
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  console.log('Connected to MongoDB.')

  try {
    await upsertDefaults()
    console.log('Migration completed successfully.')
  } catch (err) {
    console.error('Migration failed:', err)
    process.exitCode = 2
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB.')
  }
}

main().catch(err => {
  console.error('Fatal error in migration script:', err)
  process.exit(3)
})
