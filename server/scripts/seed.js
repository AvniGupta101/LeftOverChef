// server/scripts/seed.js
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

import User from '../models/User.js'
import Listing from '../models/Listing.js'
import Claim from '../models/Claim.js'

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('MongoDB connected ✅')

  // Clear old data
  await Claim.deleteMany({})
  await Listing.deleteMany({})
  await User.deleteMany({})
  console.log('Cleared old collections 🧹')

  // Create users (donors / ngo / admin)
  const [donor1, donor2, donor3, ngoUser, adminUser] = await User.create([
    { name: 'Donor One', email: 'donor1@example.com', role: 'donor', passwordHash: 'x' },
    { name: 'Donor Two', email: 'donor2@example.com', role: 'donor', passwordHash: 'x' },
    { name: 'Donor Three', email: 'donor3@example.com', role: 'donor', passwordHash: 'x' },
    { name: 'Helping Hands', email: 'ngo1@example.com', role: 'ngo', passwordHash: 'x' },
    { name: 'Admin', email: 'admin@example.com', role: 'admin', passwordHash: 'x' },
  ])

  console.log('Created users:')
  console.log({ donor1: donor1._id.toString(), ngoId: ngoUser._id.toString() })

  // Prepare listings using actual ObjectId references
  const listings = [
    {
      donorId: donor1._id,
      title: 'Cooked rice & curry',
      description: 'Fresh rice and vegetable curry, 10 plates. Ready for pickup.',
      quantity: 10,
      pickup_address: 'MG Road, Bangalore',
      pickup_lat: 12.975,
      pickup_lng: 77.605,
      images: [{ url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' }],
      status: 'approved',
    },
    {
      donorId: donor2._id,
      title: 'Bread packs',
      description: "10 sealed bread packets from today’s breakfast event.",
      quantity: 10,
      pickup_address: 'Koramangala, Bangalore',
      pickup_lat: 12.935,
      pickup_lng: 77.624,
      images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1693432053/bread_sample.jpg' }],
      status: 'approved',
    },
    {
      donorId: donor3._id,
      title: 'Vegetable curry',
      description: 'Leftover mixed-veg curry from canteen, fresh and ready.',
      quantity: 5,
      pickup_address: 'Indiranagar, Bangalore',
      pickup_lat: 12.971,
      pickup_lng: 77.641,
      images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1693432053/veg_curry.jpg' }],
      status: 'approved',
    },
  ]

  await Listing.insertMany(listings)
  console.log('Inserted listings 🎉')

  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
