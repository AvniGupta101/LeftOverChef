// client/src/components/DonorListingsList.jsx
import React from "react";

export default function DonorListingsList({ listings = [] }) {
  if (!listings || listings.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {listings.map((l) => (
        <div
          key={l._id}
          className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
        >
          {/* Image */}
          <div className="w-full h-40 bg-gray-100 rounded-md overflow-hidden mb-3">
            {l.imageUrl ? (
              <img
                src={l.imageUrl}
                alt={l.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold mb-1">{l.title}</h3>

          {/* Status + ML prediction */}
          <div className="flex items-center gap-2 text-sm mb-2">
            <span
              className={`px-2 py-1 rounded text-white ${
                l.status === "available"
                  ? "bg-green-600"
                  : l.status === "claimed"
                  ? "bg-blue-600"
                  : l.status === "picked"
                  ? "bg-gray-600"
                  : "bg-gray-400"
              }`}
            >
              {l.status}
            </span>

            {l.mlPrediction && (
              <span
                className={`px-2 py-1 rounded ${
                  l.mlPrediction === "fresh"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {l.mlPrediction} ({Math.round(l.mlConfidence * 100)}%)
              </span>
            )}
          </div>

          {/* Quantity */}
          <div className="text-sm text-gray-700">
            <strong>Quantity:</strong> {l.quantity || "--"}
          </div>

          {/* Created date */}
          <div className="text-xs text-gray-500 mt-2">
            Posted: {new Date(l.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
