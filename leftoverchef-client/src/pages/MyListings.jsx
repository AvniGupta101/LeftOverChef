// src/pages/MyListings.jsx
import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";

export default function MyListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState(null); // null = loading, [] = empty
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setListings([]); // no user => nothing
      return;
    }

    const fetchMyListings = async () => {
      try {
        // Prefer server-side endpoint /listings/mine if present
        const tryMine = await api.get("/listings/mine").catch(() => null);

        if (tryMine && tryMine.status === 200) {
          setListings(tryMine.data);
          return;
        }

        // Fallback: fetch all listings and filter client-side
        const res = await api.get("/listings");
        const all = Array.isArray(res.data) ? res.data : [];
        const mine = all.filter((l) => {
          const donorId = l.donorId?._id ?? l.donorId;
          return String(donorId) === String(user?.id);
        });
        setListings(mine);
      } catch (err) {
        console.error("Failed to load listings", err);
        setError(err?.response?.data?.error || err.message || "Failed to load");
        setListings([]); // stop loading
      }
    };

    fetchMyListings();
  }, [user]);

  if (listings === null) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Loading your listings…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!listings.length) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-semibold">My Listings</h2>
        <p className="text-gray-600 mt-2">You haven't created any listings yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">My Listings</h2>
      <div className="grid gap-4">
        {listings.map((l) => (
          <div key={l._id} className="bg-white rounded-xl shadow p-4 flex gap-4 items-center">
            <div className="w-28 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              {l.imageUrl ? (
                <img src={l.imageUrl} alt={l.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No image</div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{l.title || "Donation"}</h3>
                <span className="text-sm text-gray-500">{new Date(l.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{l.description || "—"}</p>
              <div className="mt-2 text-sm text-gray-700">
                <strong>{l.quantity}</strong> {l.unit || "servings"} •{" "}
                <span className={
                  l.status === "available" ? "text-green-600" :
                  l.status === "claimed" ? "text-yellow-600" :
                  l.status === "picked" ? "text-gray-600" : "text-red-600"
                }>
                  {l.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
