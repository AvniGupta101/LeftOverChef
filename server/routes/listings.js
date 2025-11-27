// server/routes/listings.js
import express from 'express'
import axios from 'axios'
import Listing from '../models/Listing.js'
import { requireAuth, permit } from '../middleware/auth.js'
import { uploadBase64Image } from '../config/cloudinary.js'

const router = express.Router()
const CLASSIFIER_URL = process.env.CLASSIFIER_URL || 'http://127.0.0.1:8000/classify'

// GET /api/listings - Public or protected (view all listings)
router.get('/', async (req, res) => {
  try {
    const { status, _page = 1, _limit = 20 } = req.query
    const query = status ? { status } : {}
    
    const page = Math.max(1, parseInt(_page))
    const limit = Math.max(1, parseInt(_limit))
    const skip = (page - 1) * limit

    const total = await Listing.countDocuments(query)
    const listings = await Listing.find(query)
      .populate('donorId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    res.set('X-Total-Count', total)
    return res.json(listings)
  } catch (err) {
    console.error('Get listings error:', err)
    return res.status(500).json({ error: err.message })
  }
})
router.get('/mine', requireAuth, permit(['donor']), async (req, res) => {
  try {
    const listings = await Listing.find({ donorId: req.user.id })
      .populate('donorId', 'name email')
      .sort({ createdAt: -1 });
    return res.json(listings);
  } catch (err) {
    console.error('Get my listings error:', err);
    return res.status(500).json({ error: err.message });
  }
});
// GET /api/listings/:id - Get single listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('donorId', 'name email')
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' })
    }

    return res.json(listing)
  } catch (err) {
    console.error('Get listing error:', err)
    return res.status(500).json({ error: err.message })
  }
})

// POST /api/listings - Create listing (Donor only)
// This POST now sends the image to the Python classifier service first.
// If classifier marks as "spoiled" (class 1 by default) we reject the upload.
// POST /api/listings - Create listing (Donor only)
// inside server/routes/listings.js - replace the POST '/' handler with this
router.post('/', requireAuth, permit(['donor']), async (req, res) => {
  try {
    const { 
      title, 
      description, 
      quantity, 
      unit,
      pickupAddress, 
      pickupTime,
      perishabilityHours,
      imageBase64 
    } = req.body;

    if (!title || !quantity || !pickupAddress || !imageBase64) {
      return res.status(400).json({ 
        error: 'Title, quantity, pickup address and image are required' 
      });
    }

    // Prepare classifier payload. Classifier accepts either raw base64 or data URI.
    const classifierPayload = { image_base64: imageBase64, imageBase64 }; // send both keys to be safe

    // 1) Call classifier
    let clfRes;
    try {
      clfRes = await axios.post(process.env.CLASSIFIER_URL || CLASSIFIER_URL, classifierPayload, {
        timeout: parseInt(process.env.CLASSIFIER_TIMEOUT_MS || "15000", 10),
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.error('Classifier call failed:', err?.response?.data || err.message);
      return res.status(502).json({ error: 'Image classification failed. Please try again.' });
    }

    // Expecting classifier to return { prediction: "fresh"|"spoiled", confidence: 0-1 }
    const { prediction, confidence } = clfRes.data || {};
    if (!prediction || typeof confidence !== 'number') {
      console.error('Invalid classifier response:', clfRes.data);
      return res.status(502).json({ error: 'Invalid classifier response' });
    }

    // 2) Reject if spoiled OR low confidence
    const CONF_THRESH = parseFloat(process.env.ML_CONF_THRESH || '0.5');
    if (prediction.toLowerCase() === 'spoiled' || confidence < CONF_THRESH) {
      return res.status(400).json({
        approved: false,
        error: 'Food looks spoiled or classifier confidence too low. Listing rejected.',
        ml: { prediction: prediction.toLowerCase(), confidence }
      });
    }

    // 3) Upload to Cloudinary (only after approval)
    let imageUrl = null;
    try {
      // uploadBase64Image expects data URI; your util already converts if raw base64
      imageUrl = await uploadBase64Image(imageBase64);
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return res.status(500).json({ error: "Failed to upload image" });
    }

    // 4) Save listing with ML metadata
    const listing = await Listing.create({
      donorId: req.user.id,
      title,
      description,
      quantity: Number(quantity),
      unit: unit || 'servings',
      pickupAddress,
      pickupTime: pickupTime ? new Date(pickupTime) : null,
      perishabilityHours,
      imageUrl,
      status: 'available',
      mlPrediction: prediction.toLowerCase(),
      mlConfidence: confidence
    });

    const populatedListing = await Listing.findById(listing._id)
      .populate('donorId', 'name email');

    return res.status(201).json({
      approved: true,
      listing: populatedListing
    });

  } catch (err) {
    console.error('Create listing error:', err);
    return res.status(500).json({ error: err.message });
  }
});


// PATCH /api/listings/:id/claim - Claim listing (NGO only)
router.patch('/:id/claim', requireAuth, permit(['ngo']), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' })
    }

    if (listing.status !== 'available') {
      return res.status(400).json({ error: 'Listing is not available' })
    }

    listing.status = 'claimed'
    await listing.save()

    const updatedListing = await Listing.findById(listing._id)
      .populate('donorId', 'name email')

    return res.json(updatedListing)
  } catch (err) {
    console.error('Claim listing error:', err)
    return res.status(500).json({ error: err.message })
  }
})
// add near other GET routes
// router.get('/mine', requireAuth, permit(['donor']), async (req, res) => {
//   try {
//     const listings = await Listing.find({ donorId: req.user.id })
//       .populate('donorId', 'name email')
//       .sort({ createdAt: -1 });
//     return res.json(listings);
//   } catch (err) {
//     console.error('Get my listings error:', err);
//     return res.status(500).json({ error: err.message });
//   }
// });

// PATCH /api/listings/:id/picked - Mark as picked (NGO only)
router.patch('/:id/picked', requireAuth, permit(['ngo']), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' })
    }

    if (listing.status !== 'claimed') {
      return res.status(400).json({ error: 'Listing must be claimed first' })
    }

    listing.status = 'picked'
    await listing.save()

    const updatedListing = await Listing.findById(listing._id)
      .populate('donorId', 'name email')

    return res.json(updatedListing)
  } catch (err) {
    console.error('Mark picked error:', err)
    return res.status(500).json({ error: err.message })
  }
})

// PATCH /api/listings/:id - Update listing (Donor or Admin)
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' })
    }

    // Check permissions
    const isDonor = req.user.role === 'donor' && listing.donorId.toString() === req.user.id
    const isAdmin = req.user.role === 'admin'

    if (!isDonor && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to update this listing' })
    }

    // Update allowed fields
    const updates = req.body
    Object.assign(listing, updates)
    await listing.save()

    const updatedListing = await Listing.findById(listing._id)
      .populate('donorId', 'name email')

    return res.json(updatedListing)
  } catch (err) {
    console.error('Update listing error:', err)
    return res.status(500).json({ error: err.message })
  }
})

// DELETE /api/listings/:id - Delete listing (Donor or Admin)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' })
    }

    // Check permissions
    const isDonor = req.user.role === 'donor' && listing.donorId.toString() === req.user.id
    const isAdmin = req.user.role === 'admin'

    if (!isDonor && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to delete this listing' })
    }

    await Listing.findByIdAndDelete(req.params.id)

    return res.json({ message: 'Listing deleted successfully' })
  } catch (err) {
    console.error('Delete listing error:', err)
    return res.status(500).json({ error: err.message })
  }
})

export default router
