// server/routes/users.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Adjust these paths if your project structure differs
const User = require('../models/User');
const Listing = require('../models/Listing');
const { requireAuth, permit } = require('../middleware/auth'); // optional for protected actions

// Helper: compute stats for a donor
async function computeUserStats(userId) {
  // Adjust field names if your Listing schema differs (quantity/unit etc).
  const match = { donorId: mongoose.Types.ObjectId(userId) };

  const agg = await Listing.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$donorId',
        totalListings: { $sum: 1 },
        availableNow: {
          $sum: {
            $cond: [{ $eq: ['$status', 'available'] }, 1, 0]
          }
        },
        claimed: {
          $sum: {
            $cond: [{ $eq: ['$status', 'claimed'] }, 1, 0]
          }
        },
        picked: {
          $sum: {
            $cond: [{ $eq: ['$status', 'picked'] }, 1, 0]
          }
        },
        // Here we assume `quantity` holds number of meals or units.
        // If you have a separate meals field, replace '$quantity' accordingly.
        mealsDonated: { $sum: { $ifNull: ['$quantity', 0] } }
      }
    }
  ]);

  if (agg.length === 0) {
    return {
      totalListings: 0,
      availableNow: 0,
      claimed: 0,
      picked: 0,
      mealsDonated: 0
    };
  }

  const stats = {
    totalListings: agg[0].totalListings || 0,
    availableNow: agg[0].availableNow || 0,
    claimed: agg[0].claimed || 0,
    picked: agg[0].picked || 0,
    mealsDonated: agg[0].mealsDonated || 0
  };

  return stats;
}

// GET /api/users/:id
// Public: returns basic profile info and stats
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const user = await User.findById(id).select('name email avatarUrl createdAt role'); // select only public fields
    if (!user) return res.status(404).json({ message: 'User not found' });

    const stats = await computeUserStats(id);

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email, // if you want to hide email for public profiles, remove this line
      avatarUrl: user.avatarUrl || null,
      joinedAt: user.createdAt,
      stats
    });
  } catch (err) {
    console.error('GET /api/users/:id error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/:id/listings
// Public: returns listings by donorId, supports pagination & status filter
// Query params: page, limit, status, q (search)
router.get('/:id/listings', async (req, res) => {
  try {
    const { id } = req.params;
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
    const skip = (page - 1) * limit;
    const { status, q } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const filter = { donorId: mongoose.Types.ObjectId(id) };
    if (status) filter.status = status; // e.g. available, claimed, picked

    if (q) {
      // simple text search on title/description (requires text index for better perf)
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    const [total, listings] = await Promise.all([
      Listing.countDocuments(filter),
      Listing.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('title description quantity unit pickupAddress pickupTime perishabilityHours imageUrl status mlPrediction mlConfidence createdAt updatedAt') // select fields to return
        .lean()
    ]);

    return res.json({
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: listings
    });
  } catch (err) {
    console.error('GET /api/users/:id/listings error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
