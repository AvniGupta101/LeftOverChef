// src/components/ClaimModal.jsx
import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

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

  // Prefill NGO name / phone from logged-in user if available
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const listingId = listing._id || listing.id || listing.listingId;
      if (!listingId) throw new Error("Invalid listing id");

      const body = {
        listingId,
        contactInfo: {
          name: formData.ngoName,
          phone: formData.phone,
        },
        message: formData.message,
      };

      // POST to backend. Auth header is attached by AuthContext (axios defaults).
      const res = await api.post("/claims", body);

      // success: invalidate relevant queries so UI updates
      qc.invalidateQueries({ queryKey: ["listings"] });
      qc.invalidateQueries({ queryKey: ["claims"] });

      toast.success("Claim submitted successfully.");
      if (onSuccess) onSuccess(res.data);

      // close modal
      onClose?.();
    } catch (err) {
      console.error("Claim error:", err);
      const msg = err?.response?.data?.error || err.message || "Failed to submit claim.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-3">Claim: {listing.title}</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="ngoName"
            value={formData.ngoName}
            onChange={handleChange}
            required
            placeholder="NGO name"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Phone number"
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Note (optional)"
            className="w-full border px-3 py-2 rounded"
            rows="3"
          />

          {error && <div className="text-sm text-red-500">{error}</div>}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-2 rounded border">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-2 rounded bg-indigo-600 text-white disabled:opacity-60"
            >
              {isSubmitting ? "Submitting…" : "Submit Claim"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
