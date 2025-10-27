// src/components/ClaimModal.jsx
import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { X, User, Phone, MessageSquare } from "lucide-react";

export default function ClaimModal({ listing, onClose, onSuccess }) {
  const { user } = useAuth();
  const qc = useQueryClient();

  const [formData, setFormData] = useState({
    ngoName: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData((s) => ({
        ...s,
        ngoName: s.ngoName || user.name || "",
        phone: s.phone || user.phone || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // helper to parse strings like "50 lbs", "12.5 kg" -> 50 or 12.5
  const parseQuantityToNumber = (qty) => {
    if (qty == null) return null;
    if (typeof qty === "number") return qty;
    const numericStr = String(qty).replace(/[^\d.]/g, "");
    if (!numericStr) return null;
    const value = parseFloat(numericStr);
    return Number.isFinite(value) ? value : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const listingId = listing._id || listing.id || listing.listingId;
      if (!listingId) throw new Error("Invalid listing id");

      // If listing has a quantity stored as a string like "50 lbs", parse & patch it
      if (listing?.quantity && typeof listing.quantity === "string") {
        const parsedQty = parseQuantityToNumber(listing.quantity);
        if (parsedQty === null) {
          const msg =
            "Listing quantity is invalid. Please ask the donor to provide a numeric quantity (e.g. 50).";
          setError(msg);
          toast.error(msg);
          setIsSubmitting(false);
          return;
        }

        // Patch listing to update numeric quantity before creating claim
        try {
          await api.patch(`/listings/${listingId}`, { quantity: parsedQty });
          // Optionally update local listing object reference so subsequent logic uses numeric quantity
          listing.quantity = parsedQty;
        } catch (patchErr) {
          console.error("Failed to sanitize listing quantity:", patchErr);
          const msg = "Failed to normalize listing quantity. Try again later.";
          setError(msg);
          toast.error(msg);
          setIsSubmitting(false);
          return;
        }
      }

      // Build claim body
      const body = {
        listingId,
        contactInfo: {
          name: formData.ngoName,
          phone: formData.phone,
        },
        message: formData.message,
      };

      const res = await api.post("/claims", body);

      // Invalidate queries to refresh listing/claims data
      qc.invalidateQueries({ queryKey: ["listings"] });
      qc.invalidateQueries({ queryKey: ["claims"] });

      toast.success("Claim submitted successfully!");
      if (onSuccess) onSuccess(res.data);

      onClose?.();
    } catch (err) {
      console.error("Claim error:", err);
      // try to surface backend error message if present
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message ||
        "Failed to submit claim.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Claim Donation</h3>
              <p className="text-white/90 text-sm">{listing?.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                NGO Name
              </div>
            </label>
            <input
              name="ngoName"
              value={formData.ngoName}
              onChange={handleChange}
              required
              placeholder="Enter your NGO name"
              className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </div>
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your contact number"
              className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Message (Optional)
              </div>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Add any additional information..."
              className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors resize-none"
              rows="4"
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Claim"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
