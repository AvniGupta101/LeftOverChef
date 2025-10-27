// routes/listings.js
import express from 'express'
import Listing from '../models/Listing.js'
import { requireAuth } from '../middleware/auth.js'
import multer from 'multer'
import streamifier from 'streamifier'
import cloudinary from '../config/cloudinary.js'

const router = express.Router()
const upload = multer() // memory storage

// GET /api/listings  (supports ?status=approved and pagination via _page/_limit)
router.get('/', async (req, res) => {
  try {
    const { status, _page = 1, _limit = 20 } = req.query
    const q = status ? { status } : {}
    const page = Math.max(1, parseInt(_page))
    const limit = Math.max(1, parseInt(_limit))
    const skip = (page - 1) * limit
    const total = await Listing.countDocuments(q)
    const items = await Listing.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit)
    res.set('X-Total-Count', total)
    return res.json(items)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

// GET /api/listings/:id
router.get('/:id', async (req, res) => {
  try {
    const doc = await Listing.findById(req.params.id)
    if (!doc) return res.status(404).json({ error: 'Not found' })
    return res.json(doc)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

// POST /api/listings (donor upload) - multipart/form-data with images
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, quantity, pickup_address, pickup_lat, pickup_lng, expires_at, tags } = req.body
    const images = []

    // upload files to Cloudinary (if present)
    for (const file of req.files || []) {
      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: 'leftoverchef' }, (error, result) => {
            if (result) resolve(result)
            else reject(error)
          })
          streamifier.createReadStream(file.buffer).pipe(stream)
        })
      const result = await streamUpload()
      images.push({ url: result.secure_url, public_id: result.public_id })
    }

    const listing = await Listing.create({
      title,
      description,
      quantity,
      pickup_address,
      pickup_lat,
      pickup_lng,
      images,
      status: 'pending',
      expires_at: expires_at || null,
      tags: tags ? tags.split(',') : []
    })

    return res.status(201).json(listing)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message })
  }
})

// PATCH /api/listings/:id (update status or fields)
router.patch('/:id', async (req, res) => {
  try {
    const updates = req.body
    const doc = await Listing.findByIdAndUpdate(req.params.id, updates, { new: true })
    if (!doc) return res.status(404).json({ error: 'Not found' })
    return res.json(doc)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

// DELETE /api/listings/:id
router.delete('/:id', async (req, res) => {
  try {
    const doc = await Listing.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ error: 'Not found' })
    return res.json({ ok: true })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

export default router
