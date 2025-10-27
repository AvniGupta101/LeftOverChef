// src/pages/ListingsPage.jsx
import React, { useState } from "react";
import { useListings } from "../hooks/useListings";
import ClaimModal from "../components/ClaimModal";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ListingsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useListings({ status: "approved" });
  const [selectedListing, setSelectedListing] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isLoading) return <div className="text-center mt-10">Loading listings...</div>;
  if (isError) return <div className="text-center text-red-500 mt-10">Error loading listings!</div>;

  // onSuccess: called after claim POST returns
  const handleClaimSuccess = async (createdClaim) => {
    try {
      // Ensure we have the listing id (backend returns listingId)
      const listingId = createdClaim.listingId || createdClaim.listing || createdClaim.listing_id;
      if (!listingId) {
        console.warn("No listingId on created claim:", createdClaim);
      } else {
        // Patch listing status via API (backend expects /api/listings/:id)
        await api.patch(`/listings/${listingId}`, {
          status: "claimed",
        });
      }

      // Refetch listings and claims so UI updates
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["claims"] });

      console.log(`Listing ${listingId} marked as claimed`);
      toast.success("Listing claimed — check My Claims to follow up");
    } catch (err) {
      console.error("Failed to mark listing claimed:", err);
      toast.error("Failed to update listing status");
    } finally {
      // Close modal
      setSelectedListing(null);
    }
  };

  // click handler that enforces auth & role
  const onClaimClick = (listing) => {
    if (!isAuthenticated) {
      toast.info("Please log in as an NGO to claim donations.");
      navigate("/login");
      return;
    }
    if (user?.role !== "ngo") {
      toast.warn("Only NGOs can claim donations. Please register/login as an NGO.");
      return;
    }

    setSelectedListing(listing);
  };

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <h1 className="text-2xl font-semibold mb-4 text-indigo-700">Available Donations</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {(data || []).map((listing) => {
          const lid = listing._id || listing.id || listing.listingId;
          return (
            <div key={lid} className="bg-white shadow rounded p-4 hover:shadow-lg">
              <img
                src={listing.images?.[0]?.url || "https://via.placeholder.com/600x400?text=No+Image"}
                alt={listing.title}
                className="h-40 w-full object-cover rounded"
              />
              <h2 className="font-bold mt-3 text-lg">{listing.title}</h2>
              <p className="text-sm text-gray-600">{(listing.description || "").slice(0, 80)}...</p>
              <p className="text-xs mt-2 text-gray-500">Status: {listing.status}</p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => onClaimClick(listing)}
                  className={`text-sm px-4 py-2 rounded-lg ${
                    user?.role === "ngo" ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  Claim
                </button>

                {/* optional: view details link (later) */}
                {/* <Link to={`/listing/${lid}`} className="text-sm text-gray-600 underline">View</Link> */}
              </div>
            </div>
          );
        })}
      </div>

      {selectedListing && (
        <ClaimModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onSuccess={handleClaimSuccess}
        />
      )}
    </div>
  );
}
