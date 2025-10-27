// src/pages/MyClaims.jsx
import React from "react";
import { useClaims } from "../hooks/useClaims";
import { api } from "../api/client";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export default function MyClaims() {
  const qc = useQueryClient();
  const { data: claims = [], isLoading, isError } = useClaims();

  // mutation to update claim status (cancel)
   const cancelMutation = useMutation({
    // mutation function (v5 style)
    mutationFn: async (claimId) => {
      const { data } = await api.patch(`/claims/${claimId}`, { status: "cancelled" });
      return data;
    },

    // Optimistic update: update cache before server responds
    onMutate: async (claimId) => {
      await qc.cancelQueries({ queryKey: ["claims"] });

      // Snapshot previous value
      const previous = qc.getQueryData(["claims"]);

      // Optimistically update the cache: mark the claim as cancelled locally
      qc.setQueryData(["claims"], (old = []) =>
        old.map((c) => {
          if ((c._id || c.id) === claimId) {
            return { ...c, status: "cancelled" };
          }
          return c;
        })
      );

      // return context for rollback
      return { previous };
    },

    // If the mutation fails, rollback to previous state
    onError: (err, variables, context) => {
      if (context?.previous) {
        qc.setQueryData(["claims"], context.previous);
      }
      console.error("Cancel failed:", err);
      alert("Failed to cancel claim. See console for details.");
    },

    // On success, invalidate to refetch fresh data from server
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["claims"] });
      qc.invalidateQueries({ queryKey: ["listings"] }); // listing status may have changed
    },
  });


  const handleCancel = (claimId) => {
    if (!confirm("Cancel this claim?")) return;
    cancelMutation.mutate(claimId);
  };

  if (isLoading) return <div className="text-center mt-10">Loading your claims...</div>;
  if (isError) return <div className="text-center text-red-500 mt-10">Failed to load claims.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-4 text-indigo-700">My Claims</h1>

      {(!claims || claims.length === 0) && (
        <div className="bg-white p-6 rounded shadow text-center">You have not made any claims yet.</div>
      )}

      <div className="space-y-4">
        {claims.map((c) => {
          const id = c._id || c.id;
          return (
            <div key={id} className="bg-white p-4 rounded shadow flex justify-between items-start">
              <div>
                <div className="text-lg font-medium">
                  <Link to={`/listing/${c.listingId}`} className="text-indigo-600 hover:underline">
                    {c.listingId ? `Listing: ${c.listingId}` : "Listing"}
                  </Link>
                </div>
                {c.message && <div className="text-sm text-gray-600 mt-1">{c.message}</div>}
                <div className="text-xs text-gray-500 mt-2">
                  Contact: {c.contactInfo?.name ?? "—"} • {c.contactInfo?.phone ?? "—"}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500">Status</div>
                <div
                  className={`mt-1 font-semibold ${
                    c.status === "requested"
                      ? "text-yellow-600"
                      : c.status === "confirmed"
                      ? "text-green-600"
                      : c.status === "cancelled"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {c.status}
                </div>
                <div className="text-xs text-gray-400 mt-2">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}</div>

                <div className="mt-3">
                  {c.status !== "cancelled" && c.status !== "confirmed" && (
                    <button
                      onClick={() => handleCancel(id)}
                      className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                      disabled={cancelMutation.isLoading}
                    >
                      {cancelMutation.isLoading ? "Cancelling…" : "Cancel"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
