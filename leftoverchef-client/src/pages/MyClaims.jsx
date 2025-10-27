// src/pages/MyClaims.jsx
import React from "react";
import { useClaims } from "../hooks/useClaims";
import { api } from "../api/client";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Clock, MapPin, Phone, User, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";

export default function MyClaims() {
  const qc = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const { data: claims = [], isLoading, isError } = useClaims();

  const cancelMutation = useMutation({
    mutationFn: async (claimId) => {
      const { data } = await api.patch(`/claims/${claimId}`, { status: "cancelled" });
      return data;
    },
    onMutate: async (claimId) => {
      await qc.cancelQueries({ queryKey: ["claims"] });
      const previous = qc.getQueryData(["claims"]);
      qc.setQueryData(["claims"], (old = []) =>
        old.map((c) => ((c._id || c.id) === claimId ? { ...c, status: "cancelled" } : c))
      );
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        qc.setQueryData(["claims"], context.previous);
      }
      console.error("Cancel failed:", err);
      toast.error("Failed to cancel claim");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["claims"] });
      qc.invalidateQueries({ queryKey: ["listings"] });
      toast.success("Claim cancelled successfully");
    },
  });

  const handleCancel = (claimId) => {
    if (!confirm("Cancel this claim?")) return;
    cancelMutation.mutate(claimId);
  };

  // Check if user is not logged in
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/20 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h3>
            <p className="text-gray-600 mb-6">You need to be logged in as an NGO to view your claims</p>
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your claims...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600">Failed to load claims. Please try again.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "requested": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed": return "bg-green-100 text-green-800 border-green-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      case "fulfilled": return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "requested": return <AlertCircle className="w-5 h-5" />;
      case "confirmed": return <CheckCircle className="w-5 h-5" />;
      case "cancelled": return <XCircle className="w-5 h-5" />;
      case "fulfilled": return <CheckCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/20 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Claims</h1>
          <p className="text-gray-600 text-lg">Track and manage your food donation claims</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Claims", value: claims.length, color: "indigo" },
            { label: "Requested", value: claims.filter(c => c.status === "requested").length, color: "yellow" },
            { label: "Confirmed", value: claims.filter(c => c.status === "confirmed").length, color: "green" },
            { label: "Fulfilled", value: claims.filter(c => c.status === "fulfilled").length, color: "purple" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
              <div className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Claims List */}
        {(!claims || claims.length === 0) ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No claims yet</h3>
            <p className="text-gray-600 mb-6">Start claiming donations to help those in need</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Browse Donations
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {claims.map((c) => {
              const id = c._id || c.id;
              return (
                <div key={id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      {/* Left Section - Claim Details */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex-1">
                            <Link 
                              to={`/listing/${c.listingId}`}
                              className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors"
                            >
                              Claim #{id.slice(-6)}
                            </Link>
                            <p className="text-sm text-gray-500 mt-1">
                              Listing ID: {c.listingId}
                            </p>
                          </div>
                          
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(c.status)}`}>
                            {getStatusIcon(c.status)}
                            <span className="font-semibold text-sm capitalize">{c.status}</span>
                          </div>
                        </div>

                        {c.message && (
                          <div className="bg-gray-50 rounded-xl p-4 mb-4">
                            <p className="text-sm text-gray-700">{c.message}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>{c.contactInfo?.name || "—"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{c.contactInfo?.phone || "—"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Actions */}
                      <div className="flex flex-col gap-3 lg:w-48">
                        <Link
                          to={`/listing/${c.listingId}`}
                          className="px-4 py-2 text-center bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
                        >
                          View Details
                        </Link>
                        
                        {c.status !== "cancelled" && c.status !== "confirmed" && c.status !== "fulfilled" && (
                          <button
                            onClick={() => handleCancel(id)}
                            disabled={cancelMutation.isLoading}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-all disabled:opacity-50"
                          >
                            {cancelMutation.isLoading ? "Cancelling..." : "Cancel Claim"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress Timeline */}
                  {c.status !== "cancelled" && (
                    <div className="bg-gradient-to-r from-gray-50 to-indigo-50/50 px-6 py-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs">
                        <div className={`flex items-center gap-2 ${c.status === "requested" ? "text-yellow-600 font-semibold" : "text-gray-400"}`}>
                          <div className={`w-2 h-2 rounded-full ${c.status === "requested" ? "bg-yellow-600" : "bg-gray-300"}`}></div>
                          Requested
                        </div>
                        <div className="flex-1 h-px bg-gray-300 mx-4"></div>
                        <div className={`flex items-center gap-2 ${c.status === "confirmed" ? "text-green-600 font-semibold" : "text-gray-400"}`}>
                          <div className={`w-2 h-2 rounded-full ${c.status === "confirmed" ? "bg-green-600" : "bg-gray-300"}`}></div>
                          Confirmed
                        </div>
                        <div className="flex-1 h-px bg-gray-300 mx-4"></div>
                        <div className={`flex items-center gap-2 ${c.status === "fulfilled" ? "text-indigo-600 font-semibold" : "text-gray-400"}`}>
                          <div className={`w-2 h-2 rounded-full ${c.status === "fulfilled" ? "bg-indigo-600" : "bg-gray-300"}`}></div>
                          Fulfilled
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}