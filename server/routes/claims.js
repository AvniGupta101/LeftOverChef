// server/routes/claims.js
import express from "express";
import Claim from "../models/Claim.js";
import mongoose from "mongoose";
import Listing from "../models/Listing.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// Helper function to parse quantity
function parseQuantityToNumber(qty) {
  if (qty == null) return null;
  if (typeof qty === 'number') return qty;
  const numericStr = String(qty).replace(/[^\d.]/g, '');
  if (!numericStr) return null;
  const value = parseFloat(numericStr);
  return Number.isFinite(value) ? value : null;
}

// GET /api/claims?ngoId=xxx  (admins may see all later)
router.get("/", requireAuth, async (req, res) => {
  console.log("/api/claims called — req.user:", req.user, " req.query:", req.query);
  try {
    const { ngoId } = req.query;
    const q = {};

    if (ngoId) {
      if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
      }
      q.ngoId = ngoId;
    } else {
      if (req.user.role === "ngo") {
        q.ngoId = req.user.id;
      } else if (req.user.role === "admin") {
        // admins get everything if no filter
      } else {
        return res.status(403).json({ error: "Forbidden" });
      }
    }

    const items = await Claim.find(q).sort({ createdAt: -1 });
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/claims  — requires auth (NGO)
router.post("/", requireAuth, async (req, res) => {
  try {
    console.log("=== POST /api/claims ===");
    console.log("req.user:", req.user);
    console.log("req.body:", req.body);

    // only NGOs may create claims
    if (req.user.role !== "ngo") {
      return res.status(403).json({ error: "Only NGOs may create claims" });
    }

    const { listingId, contactInfo, message } = req.body;
    
    // validate required fields
    if (!listingId) {
      return res.status(400).json({ error: "listingId required" });
    }

    // validate listingId format
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({ error: "Invalid listingId format" });
    }

    // check listing exists and is claimable
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    
    if (listing.status === "claimed") {
      return res.status(400).json({ error: "Listing already claimed" });
    }

    // FIX: Auto-sanitize quantity if it's a string
    if (listing.quantity && typeof listing.quantity === 'string') {
      const parsedQty = parseQuantityToNumber(listing.quantity);
      if (parsedQty !== null) {
        console.log(`Auto-fixing quantity: "${listing.quantity}" -> ${parsedQty}`);
        listing.quantity = parsedQty;
        await listing.save();
      }
    }

    // create claim, set ngoId from req.user
    const claim = await Claim.create({
      listingId: listing._id,
      ngoId: req.user.id,
      status: "requested",
      contactInfo: contactInfo || { name: req.user.name, phone: req.user.phone },
      message: message || "",
    });

    console.log("Claim created successfully:", claim._id);

    // Optionally mark listing claimed
    listing.status = "claimed";
    await listing.save();

    return res.status(201).json(claim);
  } catch (err) {
    console.error("=== POST /api/claims ERROR ===");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    
    // Return detailed error for debugging
    return res.status(500).json({ 
      error: err.message,
      name: err.name,
      details: err.errors || err.toString()
    });
  }
});

router.post("/fulfill", requireAuth, async (req, res) => {
  try {
    console.log("== /api/claims/fulfill called ==");
    console.log("req.user:", req.user && (req.user.raw || req.user));
    console.log("req.body:", req.body);

    if (!req.user) return res.status(401).json({ error: "not authenticated (req.user missing)" });
    if (req.user.role !== "ngo") return res.status(403).json({ error: "Only NGOs may mark fulfilled" });

    const { listingId } = req.body;
    if (!listingId) return res.status(400).json({ error: "listingId required" });

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({ error: "invalid listingId" });
    }

    const claim = await Claim.findOne({ listingId: listingId, ngoId: req.user.id });
    if (!claim) {
      console.log("Fulfill: claim not found for listingId", listingId, "ngoId", req.user.id);
      return res.status(404).json({ error: "Claim not found for this NGO/listing" });
    }

    claim.status = "fulfilled";

    try {
      await claim.save();
    } catch (saveErr) {
      if (saveErr.name === "ValidationError") {
        console.error("Claim save validation failed:", saveErr);
        const validationErrors = {};
        for (const key in saveErr.errors) validationErrors[key] = saveErr.errors[key].message;
        return res.status(400).json({
          error: "Claim validation failed",
          details: validationErrors,
        });
      }
      throw saveErr;
    }

    const listing = await Listing.findById(listingId);
    if (listing) {
      listing.status = "fulfilled";
      try {
        await listing.save();
      } catch (listErr) {
        console.error("Listing save error:", listErr);
        return res.status(500).json({ error: "Listing save failed", details: listErr.message });
      }
    } else {
      console.log("Fulfill: listing not found for id", listingId);
    }

    return res.json({ ok: true, claim });
  } catch (err) {
    console.error("Fulfill route unexpected error:", err);
    return res.status(500).json({ error: err.message, name: err.name });
  }
});

// PATCH /api/claims/:id  (update status — e.g., cancel)
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ error: "Not found" });

    if (req.user.role !== "admin" && req.user.id !== claim.ngoId.toString()) {
      return res.status(403).json({ error: "Forbidden" });
    }

    Object.assign(claim, req.body);
    await claim.save();
    return res.json(claim);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;