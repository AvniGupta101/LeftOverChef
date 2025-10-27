// server/scripts/fixQuantities.js
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

import Listing from '../models/Listing.js'

function parseQuantityToNumber(qty) {
  if (qty == null) return null;
  if (typeof qty === 'number') return qty;
  const numericStr = String(qty).replace(/[^\d.]/g, '');
  if (!numericStr) return null;
  const value = parseFloat(numericStr);
  return Number.isFinite(value) ? value : null;
}

async function fixQuantities() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('MongoDB connected ✅')

  const listings = await Listing.find({});
  let fixed = 0;
  
  for (const listing of listings) {
    if (typeof listing.quantity === 'string') {
      const parsed = parseQuantityToNumber(listing.quantity);
      if (parsed !== null) {
        listing.quantity = parsed;
        await listing.save();
        console.log(`Fixed listing ${listing._id}: "${listing.quantity}" -> ${parsed}`);
        fixed++;
      } else {
        console.log(`⚠️  Could not parse quantity for listing ${listing._id}: "${listing.quantity}"`);
      }
    }
  }

  console.log(`\n✅ Fixed ${fixed} listings`);
  process.exit(0);
}

fixQuantities().catch((err) => {
  console.error('Fix failed:', err)
  process.exit(1)
})