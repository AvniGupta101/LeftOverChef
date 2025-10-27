// server/controllers/claimsController.js  (example)
import Claim from "../models/Claim.js";

export async function getClaims(req, res) {
  try {
    const ngoId = req.user?.id || req.user?._id; // depends how you encoded token
    if (!ngoId) return res.status(401).json({ error: "Unauthorized" });

    const claims = await Claim.find({ ngoId }).sort({ createdAt: -1 });
    return res.json(claims);
  } catch (err) {
    console.error("getClaims error:", err);
    return res.status(500).json({ error: "Failed to fetch claims" });
  }
}
