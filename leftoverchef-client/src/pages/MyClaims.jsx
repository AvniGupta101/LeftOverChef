// src/pages/MyClaims.jsx
import React, { useState } from "react";
import { useClaims } from "../hooks/useClaims";
import { api } from "../api/client";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { 
  Clock, MapPin, Phone, User, CheckCircle, XCircle, AlertCircle, 
  Package, Calendar, MessageSquare, TrendingUp, Filter, Search,
  ChevronRight, ExternalLink
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";

export default function MyClaims() {
  const qc = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const { data: claims = [], isLoading, isError } = useClaims();
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">Authentication Required</h3>
          <p className="text-gray-600 mb-8 text-lg">Please log in as an NGO to view your claims</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Go to Login
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-8 border-indigo-200 rounded-full"></div>
            <div className="w-24 h-24 border-8 border-indigo-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="mt-6 text-lg text-gray-700 font-medium">Loading your claims...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-3xl p-12 shadow-xl max-w-md">
          <div className="text-7xl mb-6">😔</div>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">Something Went Wrong</h3>
          <p className="text-gray-600 mb-6">Failed to load claims. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    const configs = {
      requested: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <AlertCircle className="w-4 h-4" />,
        label: "Requested",
        gradient: "from-yellow-400 to-orange-400"
      },
      confirmed: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Confirmed",
        gradient: "from-green-400 to-emerald-400"
      },
      cancelled: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <XCircle className="w-4 h-4" />,
        label: "Cancelled",
        gradient: "from-red-400 to-pink-400"
      },
      fulfilled: {
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Fulfilled",
        gradient: "from-indigo-400 to-purple-400"
      }
    };
    return configs[status] || configs.requested;
  };

  const filteredClaims = claims.filter(claim => {
    const matchesStatus = filterStatus === "all" || claim.status === filterStatus;
    const matchesSearch = searchTerm === "" || 
      claim.listingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.contactInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: claims.length,
    requested: claims.filter(c => c.status === "requested").length,
    confirmed: claims.filter(c => c.status === "confirmed").length,
    fulfilled: claims.filter(c => c.status === "fulfilled").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/20">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-bold mb-3">My Claims Dashboard</h1>
              <p className="text-white/90 text-xl">Track and manage your food donation claims</p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                <Package className="w-12 h-12" />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Claims", value: stats.total, icon: Package, gradient: "from-blue-400 to-indigo-400" },
              { label: "Requested", value: stats.requested, icon: Clock, gradient: "from-yellow-400 to-orange-400" },
              { label: "Confirmed", value: stats.confirmed, icon: CheckCircle, gradient: "from-green-400 to-emerald-400" },
              { label: "Fulfilled", value: stats.fulfilled, icon: TrendingUp, gradient: "from-purple-400 to-pink-400" },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 bg-gradient-to-br ${stat.gradient} rounded-lg`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-white/80 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by listing ID or contact name..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
            
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
              <Filter className="w-5 h-5 text-gray-400 ml-3" />
              {["all", "requested", "confirmed", "fulfilled", "cancelled"].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    filterStatus === status
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Claims List */}
        {(!filteredClaims || filteredClaims.length === 0) ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-16 h-16 text-indigo-300" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">No Claims Found</h3>
            <p className="text-gray-600 text-lg mb-8">
              {filterStatus !== "all" 
                ? `No ${filterStatus} claims at the moment` 
                : "Start claiming donations to help those in need"}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Browse Donations
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredClaims.map((claim) => {
              const id = claim._id || claim.id;
              const statusConfig = getStatusConfig(claim.status);
              
              return (
                <div key={id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                  {/* Colored Top Bar */}
                  <div className={`h-2 bg-gradient-to-r ${statusConfig.gradient}`}></div>
                  
                  <div className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      {/* Left Section */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                                <Package className="w-6 h-6 text-indigo-600" />
                              </div>
                              <h3 className="text-2xl font-bold text-gray-900">
                                Claim #{id.slice(-6).toUpperCase()}
                              </h3>
                            </div>
                            <Link 
                              to={`/listing/${claim.listingId}`}
                              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium group/link"
                            >
                              <span>View Listing Details</span>
                              <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                            </Link>
                          </div>
                          
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${statusConfig.color} font-semibold text-sm`}>
                            {statusConfig.icon}
                            <span>{statusConfig.label}</span>
                          </div>
                        </div>

                        {claim.message && (
                          <div className="bg-gradient-to-r from-gray-50 to-indigo-50/30 rounded-xl p-5 mb-6 border border-gray-100">
                            <div className="flex items-start gap-3">
                              <MessageSquare className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Message</div>
                                <p className="text-gray-700 leading-relaxed">{claim.message}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <User className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 font-medium mb-0.5">Contact Name</div>
                              <div className="text-sm font-semibold text-gray-900">
                                {claim.contactInfo?.name || "—"}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <Phone className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 font-medium mb-0.5">Phone Number</div>
                              <div className="text-sm font-semibold text-gray-900">
                                {claim.contactInfo?.phone || "—"}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <Calendar className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 font-medium mb-0.5">Claimed On</div>
                              <div className="text-sm font-semibold text-gray-900">
                                {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                }) : "—"}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <MapPin className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 font-medium mb-0.5">Listing ID</div>
                              <div className="text-sm font-semibold text-gray-900 font-mono">
                                {claim.listingId?.slice(-8) || "—"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Actions */}
                      <div className="lg:w-56 flex flex-col gap-3">
                        <Link
                          to={`/listing/${claim.listingId}`}
                          className="px-6 py-3 text-center bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-xl font-semibold hover:from-indigo-100 hover:to-purple-100 transition-all border-2 border-indigo-100 hover:border-indigo-200"
                        >
                          View Full Details
                        </Link>
                        
                        {claim.status !== "cancelled" && claim.status !== "confirmed" && claim.status !== "fulfilled" && (
                          <button
                            onClick={() => handleCancel(id)}
                            disabled={cancelMutation.isLoading}
                            className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all border-2 border-red-100 hover:border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {cancelMutation.isLoading ? "Cancelling..." : "Cancel Claim"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress Timeline */}
                  {claim.status !== "cancelled" && (
                    <div className="bg-gradient-to-r from-gray-50 via-indigo-50/30 to-purple-50/20 px-8 py-6 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        {["requested", "confirmed", "fulfilled"].map((status, idx) => {
                          const isActive = claim.status === status;
                          const isPast = ["requested", "confirmed", "fulfilled"].indexOf(claim.status) > idx;
                          const statusConfig = getStatusConfig(status);
                          
                          return (
                            <React.Fragment key={status}>
                              <div className="flex flex-col items-center gap-2">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                                  isActive || isPast 
                                    ? `bg-gradient-to-br ${statusConfig.gradient} shadow-lg` 
                                    : "bg-gray-200"
                                }`}>
                                  {statusConfig.icon}
                                </div>
                                <div className={`text-xs font-semibold text-center ${
                                  isActive ? "text-gray-900" : isPast ? "text-gray-600" : "text-gray-400"
                                }`}>
                                  {statusConfig.label}
                                </div>
                              </div>
                              
                              {idx < 2 && (
                                <div className={`flex-1 h-1 mx-4 rounded-full transition-all ${
                                  isPast ? `bg-gradient-to-r ${statusConfig.gradient}` : "bg-gray-200"
                                }`}></div>
                              )}
                            </React.Fragment>
                          );
                        })}
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