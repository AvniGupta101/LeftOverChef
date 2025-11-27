// server/routes/users.js
import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Listing from '../models/Listing.js';
import { requireAuth, permit } from '../middleware/auth.js';

const router = express.Router();

// Helper: compute stats for a donor
async function computeUserStats(userId) {
  const match = { donorId: new mongoose.Types.ObjectId(userId) };

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

// GET /api/users/:id - Get user profile
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const user = await User.findById(id).select('name email avatarUrl createdAt role');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const stats = await computeUserStats(id);

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl || null,
      joinedAt: user.createdAt,
      stats
    });
  } catch (err) {
    console.error('GET /api/users/:id error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/:id/listings - Get listings by user
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

    const filter = { donorId: new mongoose.Types.ObjectId(id) };
    if (status) filter.status = status;

    if (q) {
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
        .select('title description quantity unit pickupAddress pickupTime perishabilityHours imageUrl status mlPrediction mlConfidence createdAt updatedAt')
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

export default router;