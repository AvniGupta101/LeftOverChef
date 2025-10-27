// // src/pages/ListingsPage.jsx
// import React, { useState } from "react";
// import { useListings } from "../hooks/useListings";
// import ClaimModal from "../components/ClaimModal";
// import { useQueryClient } from "@tanstack/react-query";
// import { api } from "../api/client";
// import { useAuth } from "../hooks/useAuth";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// export default function ListingsPage() {
//   const queryClient = useQueryClient();
//   const { data, isLoading, isError } = useListings({ status: "approved" });
//   const [selectedListing, setSelectedListing] = useState(null);
//   const { user, isAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   if (isLoading) return <div className="text-center mt-10">Loading listings...</div>;
//   if (isError) return <div className="text-center text-red-500 mt-10">Error loading listings!</div>;

//   // onSuccess: called after claim POST returns
//   const handleClaimSuccess = async (createdClaim) => {
//     try {
//       // Ensure we have the listing id (backend returns listingId)
//       const listingId = createdClaim.listingId || createdClaim.listing || createdClaim.listing_id;
//       if (!listingId) {
//         console.warn("No listingId on created claim:", createdClaim);
//       } else {
//         // Patch listing status via API (backend expects /api/listings/:id)
//         await api.patch(`/listings/${listingId}`, {
//           status: "claimed",
//         });
//       }

//       // Refetch listings and claims so UI updates
//       queryClient.invalidateQueries({ queryKey: ["listings"] });
//       queryClient.invalidateQueries({ queryKey: ["claims"] });

//       console.log(`Listing ${listingId} marked as claimed`);
//       toast.success("Listing claimed — check My Claims to follow up");
//     } catch (err) {
//       console.error("Failed to mark listing claimed:", err);
//       toast.error("Failed to update listing status");
//     } finally {
//       // Close modal
//       setSelectedListing(null);
//     }
//   };

//   // click handler that enforces auth & role
//   const onClaimClick = (listing) => {
//     if (!isAuthenticated) {
//       toast.info("Please log in as an NGO to claim donations.");
//       navigate("/login");
//       return;
//     }
//     if (user?.role !== "ngo") {
//       toast.warn("Only NGOs can claim donations. Please register/login as an NGO.");
//       return;
//     }

//     setSelectedListing(listing);
//   };

//   return (
//     <div className="max-w-5xl mx-auto mt-6">
//       <h1 className="text-2xl font-semibold mb-4 text-indigo-700">Available Donations</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {(data || []).map((listing) => {
//           const lid = listing._id || listing.id || listing.listingId;
//           return (
//             <div key={lid} className="bg-white shadow rounded p-4 hover:shadow-lg">
//               <img
//                 src={listing.images?.[0]?.url || "https://via.placeholder.com/600x400?text=No+Image"}
//                 alt={listing.title}
//                 className="h-40 w-full object-cover rounded"
//               />
//               <h2 className="font-bold mt-3 text-lg">{listing.title}</h2>
//               <p className="text-sm text-gray-600">{(listing.description || "").slice(0, 80)}...</p>
//               <p className="text-xs mt-2 text-gray-500">Status: {listing.status}</p>

//               <div className="mt-3 flex gap-2">
//                 <button
//                   onClick={() => onClaimClick(listing)}
//                   className={`text-sm px-4 py-2 rounded-lg ${
//                     user?.role === "ngo" ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-gray-200 text-gray-600"
//                   }`}
//                 >
//                   Claim
//                 </button>

//                 {/* optional: view details link (later) */}
//                 {/* <Link to={`/listing/${lid}`} className="text-sm text-gray-600 underline">View</Link> */}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {selectedListing && (
//         <ClaimModal
//           listing={selectedListing}
//           onClose={() => setSelectedListing(null)}
//           onSuccess={handleClaimSuccess}
//         />
//       )}
//     </div>
//   );
// }
// src/pages/ListingsPage.jsx
// src/pages/ListingsPage.jsx
import React, { useState } from "react";
import { useListings } from "../hooks/useListings";
import ClaimModal from "../components/ClaimModal";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Search, MapPin, Heart, Clock, TrendingUp, Users, Award, Star } from "lucide-react";

export default function ListingsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useListings({ status: "approved" });
  const [selectedListing, setSelectedListing] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleClaimSuccess = async (createdClaim) => {
    try {
      const listingId = createdClaim.listingId || createdClaim.listing || createdClaim.listing_id;
      if (listingId) {
        await api.patch(`/listings/${listingId}`, { status: "claimed" });
      }
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["claims"] });
      toast.success("Listing claimed successfully!");
      setSelectedListing(null);
    } catch (err) {
      console.error("Failed to mark listing claimed:", err);
      toast.error("Failed to update listing status");
    }
  };

  const onClaimClick = (listing) => {
    if (!isAuthenticated) {
      toast.info("Please log in as an NGO to claim donations.");
      navigate("/login");
      return;
    }
    if (user?.role !== "ngo") {
      toast.warn("Only NGOs can claim donations.");
      return;
    }
    setSelectedListing(listing);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600">Failed to load listings. Please try again.</p>
        </div>
      </div>
    );
  }

  const filteredListings = (data || []).filter(listing => {
    const matchesSearch = listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">Connecting Communities • Fighting Hunger</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Share Food,
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Share Love
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Join NGOs and donors in the fight against food waste. Every meal matters.
            </p>
            
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">500+</div>
                  <div className="text-white/80 text-xs">NGOs Active</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">10K+</div>
                  <div className="text-white/80 text-xs">Meals Shared</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10 mb-12">
        <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
              <Search className="w-5 h-5 text-gray-400" />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for food donations..."
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-br from-gray-50 to-indigo-50 py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Heart, label: 'Meals Donated', value: '10,234', trend: '+12%' },
              { icon: Users, label: 'Active NGOs', value: '523', trend: '+8%' },
              { icon: TrendingUp, label: 'Waste Reduced', value: '5.2 Tons', trend: '+15%' },
              { icon: Star, label: 'Success Rate', value: '98.5%', trend: '+2%' }
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-indigo-50 rounded-xl">
                    <stat.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {stat.trend}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Available Donations</h2>
            <p className="text-gray-600">Fresh food ready to be shared with those in need</p>
          </div>
          
          <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
            {['all', 'urgent', 'nearby'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeFilter === tab 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => {
            const lid = listing._id || listing.id || listing.listingId;
            return (
              <div key={lid} className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 hover:-translate-y-1">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={listing.images?.[0]?.url || "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop"}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-indigo-600 shadow-lg">
                      {listing.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {listing.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {listing.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs">{listing.pickup_address || "Location"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">Today</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onClaimClick(listing)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all hover:shadow-lg"
                    >
                      Claim Now
                    </button>
                    <Link
                      to={`/listing/${lid}`}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center"
                    >
                      <Heart className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 text-white/90">Join our community of donors and NGOs today</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
            >
              Register as NGO
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full font-semibold hover:bg-white/20 transition-all"
            >
              Become a Donor
            </Link>
          </div>
        </div>
      </div>

      {selectedListing && (
        <ClaimModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onSuccess={handleClaimSuccess}
        />
      )}
    </>
  );
}