// server/routes/claims.js
import express from "express";
import Claim from "../models/Claim.js";
import mongoose from "mongoose";
import Listing from "../models/Listing.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();



// GET /api/claims?ngoId=xxx  (admins may see all later)
router.get("/", requireAuth, async (req, res) => {
  console.log("/api/claims called — req.user:", req.user, " req.query:", req.query);
  try {
    const { ngoId } = req.query;
    // if ngoId provided and requestor is admin allow, else use req.user.id for NGO
    const q = {};

    if (ngoId) {
      // allow admin to query for other ngos
      if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
      }
      q.ngoId = ngoId;
    } else {
      // default behavior: return claims for logged-in NGO (or all for admin)
      if (req.user.role === "ngo") {
        q.ngoId = req.user.id;
      } else if (req.user.role === "admin") {
        // admins get everything if no filter
      } else {
        // other roles not allowed to list claims
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
    // only NGOs may create claims
    if (req.user.role !== "ngo") {
      return res.status(403).json({ error: "Only NGOs may create claims" });
    }

    const { listingId, contactInfo, message } = req.body;
    // validate required fields
    if (!listingId) return res.status(400).json({ error: "listingId required" });

    // check listing exists and is claimable
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    if (listing.status === "claimed") {
      return res.status(400).json({ error: "Listing already claimed" });
    }

    // create claim, set ngoId from req.user
    const claim = await Claim.create({
      listingId: listing._id,
      ngoId: req.user.id,
      status: "requested",
      contactInfo: contactInfo || { name: req.user.name, phone: req.user.phone },
      message: message || "",
    });

    // Optionally mark listing claimed server-side to avoid races
    listing.status = "claimed";
    await listing.save();

    return res.status(201).json(claim);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
// at top of file ensure mongoose is imported:
// import mongoose from "mongoose";

router.post("/fulfill", requireAuth, async (req, res) => {
  try {
    console.log("== /api/claims/fulfill called ==");
    console.log("req.user:", req.user && (req.user.raw || req.user));
    console.log("req.body:", req.body);

    if (!req.user) return res.status(401).json({ error: "not authenticated (req.user missing)" });
    if (req.user.role !== "ngo") return res.status(403).json({ error: "Only NGOs may mark fulfilled" });

    const { listingId } = req.body;
    if (!listingId) return res.status(400).json({ error: "listingId required" });

    // validate listingId format
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({ error: "invalid listingId" });
    }

    // find the claim belonging to this NGO for this listing
    const claim = await Claim.findOne({ listingId: listingId, ngoId: req.user.id });
    if (!claim) {
      console.log("Fulfill: claim not found for listingId", listingId, "ngoId", req.user.id);
      return res.status(404).json({ error: "Claim not found for this NGO/listing" });
    }

    // set claim status to a value we know is valid for most schemas.
    // If your Claim schema allows "fulfilled" then change this to "fulfilled".
    claim.status = "confirmed";

    try {
      await claim.save();
    } catch (saveErr) {
      // If Mongoose validation error, return details
      if (saveErr.name === "ValidationError") {
        console.error("Claim save validation failed:", saveErr);
        // collect error messages
        const validationErrors = {};
        for (const key in saveErr.errors) validationErrors[key] = saveErr.errors[key].message;
        return res.status(400).json({
          error: "Claim validation failed",
          details: validationErrors,
        });
      }
      // unknown save error -> bubble up
      throw saveErr;
    }

    // update listing too
    const listing = await Listing.findById(listingId);
    if (listing) {
      listing.status = "fulfilled";
      try {
        await listing.save();
      } catch (listErr) {
        console.error("Listing save error:", listErr);
        // still return success for claim but report listing issue
        return res.status(500).json({ error: "Listing save failed", details: listErr.message, stack: listErr.stack });
      }
    } else {
      console.log("Fulfill: listing not found for id", listingId);
    }

    return res.json({ ok: true, claim });
  } catch (err) {
    console.error("Fulfill route unexpected error:", err);
    // return detailed info for local debugging
    return res.status(500).json({ error: err.message, name: err.name, stack: err.stack });
  }
});



// PATCH /api/claims/:id  (update status — e.g., cancel)
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ error: "Not found" });

    // allow NGO owner or admin to update
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
