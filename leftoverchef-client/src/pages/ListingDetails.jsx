// src/pages/ListingDetails.jsx
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useListing } from "../hooks/useListing";
import { api } from "../api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

export default function ListingDetails() {
  const { id } = useParams();
  const { data: listing, isLoading, isError } = useListing(id);
  const qc = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    console.log("ListingDetail - user:", user);
    console.log("ListingDetail - listing:", listing);
  }, [user, listing]);

  const fulfillMutation = useMutation({
    mutationFn: async (listingId) => {
      const { data } = await api.post("/claims/fulfill", { listingId });
      return data;
    },
    onMutate: async (listingId) => {
      // optimistic update: set status locally to give immediate feedback
      await qc.cancelQueries({ queryKey: ["listing", listingId] });
      const previousListing = qc.getQueryData(["listing", listingId]);
      qc.setQueryData(["listing", listingId], (old) => ({ ...(old || {}), status: "fulfilled" }));
      return { previousListing };
    },
    onError: (err, listingId, context) => {
      // rollback optimistic update if needed
      if (context?.previousListing) qc.setQueryData(["listing", listingId], context.previousListing);
      console.error("Fulfill failed:", err);
      // show toast error
      const message =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to mark as fulfilled (server error).";
      toast.error(`Failed: ${message}`);
    },
    onSuccess: (data, listingId) => {
      // show success and refresh relevant queries
      toast.success("Listing marked fulfilled ✅");
      qc.invalidateQueries({ queryKey: ["listing", listingId] });
      qc.invalidateQueries({ queryKey: ["claims"] });
      qc.invalidateQueries({ queryKey: ["listings"] });
    },
  });

  if (isLoading) return <div className="p-6 text-center">Loading listing…</div>;
  if (isError) return <div className="p-6 text-red-600">Failed to load listing.</div>;
  if (!listing) return <div className="p-6">Listing not found.</div>;

  const canFulfill = !!(user && user.role === "ngo" && listing.status !== "fulfilled");
  const forceShowButtonForTesting = false;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/" className="text-indigo-600 hover:underline">← Back</Link>

      <div className="bg-white mt-4 rounded shadow overflow-hidden">
        <div className="h-64 w-full bg-gray-100">
          <img
            src={listing.images?.[0]?.url || "https://via.placeholder.com/1200x600?text=No+image"}
            alt={listing.title}
            className="h-64 w-full object-cover"
          />
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">{listing.title}</h1>
          <p className="text-gray-600 mt-3">{listing.description}</p>

          <div className="mt-4">
            <h3 className="font-semibold">Pickup address</h3>
            <div className="text-sm text-gray-700">{listing.pickup_address || "Not provided"}</div>
            {listing.pickup_lat && listing.pickup_lng && (
              <div className="text-xs text-gray-400 mt-1">
                Coordinates: {listing.pickup_lat}, {listing.pickup_lng}
              </div>
            )}
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Donor contact</h3>
            <div className="text-sm text-gray-700">{listing.contactName || listing.donorName || "—"}</div>
            <div className="text-sm text-gray-700">{listing.contactPhone || listing.phone || "—"}</div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Status: <span className="font-medium">{listing.status}</span>
          </div>

          {(canFulfill || forceShowButtonForTesting) && (
            <div className="mt-4">
              <button
                onClick={() => {
                  if (!confirm("Mark this claim & listing as fulfilled?")) return;
                  fulfillMutation.mutate(id);
                }}
                disabled={fulfillMutation.isLoading}
                className={`px-4 py-2 rounded ${fulfillMutation.isLoading ? "bg-gray-300 text-gray-600" : "bg-green-600 text-white hover:bg-green-700"}`}
              >
                {fulfillMutation.isLoading ? "Processing…" : "Mark Fulfilled"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
