// // src/pages/ListingsPage.jsx
// import React, { useState } from "react";
// import { useListings } from "../hooks/useListings";
// import ClaimModal from "../components/ClaimModal";
// import { useQueryClient } from "@tanstack/react-query";
// import { api } from "../api/client";
// import { useAuth } from "../hooks/useAuth";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   Search,
//   MapPin,
//   Heart,
//   Clock,
//   TrendingUp,
//   Users,
//   Award,
//   Star,
//   Package,
// } from "lucide-react";

// export default function ListingsPage() {
//   const queryClient = useQueryClient();
//   const { data, isLoading, isError } = useListings({ status: "approved" });
//   const [selectedListing, setSelectedListing] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeFilter, setActiveFilter] = useState("all");
//   const { user, isAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   const handleClaimSuccess = async (createdClaim) => {
//     try {
//       const listingId = createdClaim.listingId || createdClaim.listing || createdClaim.listing_id;
//       if (listingId) {
//         await api.patch(`/listings/${listingId}`, { status: "claimed" });
//       }
//       queryClient.invalidateQueries({ queryKey: ["listings"] });
//       queryClient.invalidateQueries({ queryKey: ["claims"] });
//       toast.success("Listing claimed successfully!");
//       setSelectedListing(null);
//     } catch (err) {
//       console.error("Failed to mark listing claimed:", err);
//       toast.error("Failed to update listing status");
//     }
//   };

//   const onClaimClick = (listing) => {
//     if (!isAuthenticated) {
//       toast.info("Please log in as an NGO to claim donations.");
//       navigate("/login");
//       return;
//     }
//     if (user?.role !== "ngo") {
//       toast.warn("Only NGOs can claim donations.");
//       return;
//     }
//     setSelectedListing(listing);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="text-6xl mb-4">😔</div>
//           <h3 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
//           <p className="text-gray-600">Failed to load listings. Please try again.</p>
//         </div>
//       </div>
//     );
//   }

//   const filteredListings = (data || []).filter(listing => {
//     const matchesSearch = listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          listing.description?.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesSearch;
//   });

//   return (
//     <>
//       {/* Hero Section */}
//       <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden">
//         <div className="absolute inset-0 bg-black/20"></div>
//         <div className="absolute inset-0">
//           <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
//           <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
//         </div>
        
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
//           <div className="text-center">
//             <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
//               <Award className="w-4 h-4" />
//               <span className="text-sm font-medium">Connecting Communities • Fighting Hunger</span>
//             </div>
            
//             <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
//               Share Food,
//               <br />
//               <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
//                 Share Love
//               </span>
//             </h1>
            
//             <p className="text-lg lg:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
//               Join NGOs and donors in the fight against food waste. Every meal matters.
//             </p>
            
//             <div className="flex items-center justify-center gap-8 text-sm">
//               <div className="flex items-center gap-2">
//                 <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
//                   <Users className="w-5 h-5" />
//                 </div>
//                 <div className="text-left">
//                   <div className="font-bold text-lg">500+</div>
//                   <div className="text-white/80 text-xs">NGOs Active</div>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
//                   <Heart className="w-5 h-5" />
//                 </div>
//                 <div className="text-left">
//                   <div className="font-bold text-lg">10K+</div>
//                   <div className="text-white/80 text-xs">Meals Shared</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10 mb-12">
//         <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-100">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
//               <Search className="w-5 h-5 text-gray-400" />
//               <input 
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search for food donations..."
//                 className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Section */}
//       <div className="bg-gradient-to-br from-gray-50 to-indigo-50 py-12 mb-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {[
//               { icon: Heart, label: 'Meals Donated', value: '10,234', trend: '+12%' },
//               { icon: Users, label: 'Active NGOs', value: '523', trend: '+8%' },
//               { icon: TrendingUp, label: 'Waste Reduced', value: '5.2 Tons', trend: '+15%' },
//               { icon: Star, label: 'Success Rate', value: '98.5%', trend: '+2%' }
//             ].map((stat, i) => (
//               <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="p-3 bg-indigo-50 rounded-xl">
//                     <stat.icon className="w-6 h-6 text-indigo-600" />
//                   </div>
//                   <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
//                     {stat.trend}
//                   </span>
//                 </div>
//                 <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
//                 <div className="text-sm text-gray-500">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Listings */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
//         {/* Enhanced Section Header */}
//         <div className="relative mb-12">
//           <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
//             <div className="relative">
//               <div className="inline-block">
//                 <div className="flex items-center gap-4 mb-3">
//                   <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
//                     <Package className="w-7 h-7 text-white" />
//                   </div>
//                   <h2 className="text-4xl lg:text-5xl font-bold">
//                     <span className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
//                       Available Donations
//                     </span>
//                   </h2>
//                 </div>
//                 <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-full w-32"></div>
//               </div>
//               <p className="text-gray-600 text-lg mt-4 max-w-2xl">
//                 Fresh food ready to be shared with those in need. Every meal makes a difference.
//               </p>
//             </div>
            
//             <div className="flex gap-2 bg-white rounded-2xl p-1.5 shadow-lg border border-gray-200">
//               {['all', 'urgent', 'nearby'].map(tab => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveFilter(tab)}
//                   className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
//                     activeFilter === tab 
//                       ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md transform scale-105' 
//                       : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                   }`}
//                 >
//                   {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredListings.map((listing) => {
//             const lid = listing._id || listing.id || listing.listingId;
//             return (
//               <div key={lid} className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 hover:-translate-y-1">
//                 <div className="relative h-56 overflow-hidden">
//                   <img 
//                     src={listing.images?.[0]?.url || "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop"}
//                     alt={listing.title}
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                   />
//                   <div className="absolute top-4 right-4">
//                     <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-indigo-600 shadow-lg">
//                       {listing.status}
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="p-6">
//                   <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
//                     {listing.title}
//                   </h3>
                  
//                   <p className="text-sm text-gray-600 mb-4 line-clamp-2">
//                     {listing.description}
//                   </p>
                  
//                   <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
//                     <div className="flex items-center gap-1">
//                       <MapPin className="w-4 h-4" />
//                       <span className="text-xs">{listing.pickup_address || "Location"}</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Clock className="w-4 h-4" />
//                       <span className="text-xs">Today</span>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center gap-3">
//                     <button
//                       onClick={() => onClaimClick(listing)}
//                       className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all hover:shadow-lg"
//                     >
//                       Claim Now
//                     </button>
//                     <Link
//                       to={`/listing/${lid}`}
//                       className="px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center"
//                     >
//                       <Heart className="w-5 h-5" />
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {filteredListings.length === 0 && (
//           <div className="text-center py-16">
//             <div className="text-6xl mb-4">🔍</div>
//             <h3 className="text-2xl font-bold text-gray-900 mb-2">No listings found</h3>
//             <p className="text-gray-600">Try adjusting your search or filters</p>
//           </div>
//         )}
//       </div>
//             {/* Testimonials Section */}
//       <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <div className="inline-flex items-center gap-2 bg-indigo-100 px-4 py-2 rounded-full mb-4">
//               <Star className="w-5 h-5 text-indigo-600 fill-indigo-600" />
//               <span className="text-sm font-semibold text-indigo-700">Testimonials</span>
//             </div>
//             <h2 className="text-4xl lg:text-5xl font-bold mb-4">
//               <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
//                 Stories of Impact
//               </span>
//             </h2>
//             <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//               Hear from NGOs whose communities we've helped feed through our platform
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[
//               {
//                 name: "Priya Sharma",
//                 organization: "Helping Hands Foundation",
//                 role: "Director",
//                 image: "https://ui-avatars.com/api/?name=Priya+Sharma&background=4f46e5&color=fff&size=128",
//                 rating: 5,
//                 text: "LeftoverChef has been a game-changer for us. We've been able to feed over 500 families in the last month alone. The platform makes it so easy to connect with donors and coordinate pickups.",
//                 meals: "2,000+ meals"
//               },
//               {
//                 name: "Rajesh Kumar",
//                 organization: "Food For All NGO",
//                 role: "Coordinator",
//                 image: "https://ui-avatars.com/api/?name=Rajesh+Kumar&background=9333ea&color=fff&size=128",
//                 rating: 5,
//                 text: "The real-time notifications and easy claim process have streamlined our operations. We can now respond faster to food donations and ensure nothing goes to waste. Truly grateful for this platform!",
//                 meals: "1,500+ meals"
//               },
//               {
//                 name: "Anjali Desai",
//                 organization: "Community Kitchen Project",
//                 role: "Founder",
//                 image: "https://ui-avatars.com/api/?name=Anjali+Desai&background=ec4899&color=fff&size=128",
//                 rating: 5,
//                 text: "Before LeftoverChef, coordinating food donations was chaotic. Now, everything is organized and transparent. The impact on our community has been tremendous - we're feeding more people than ever!",
//                 meals: "3,200+ meals"
//               },
//               {
//                 name: "Mohammed Ali",
//                 organization: "Urban Relief Center",
//                 role: "Operations Head",
//                 image: "https://ui-avatars.com/api/?name=Mohammed+Ali&background=10b981&color=fff&size=128",
//                 rating: 5,
//                 text: "The platform's user-friendly interface makes it accessible even for our volunteers with limited tech experience. We've significantly reduced food waste in our area while helping more families.",
//                 meals: "1,800+ meals"
//               },
//               {
//                 name: "Sunita Patel",
//                 organization: "Hope Kitchen Initiative",
//                 role: "Managing Director",
//                 image: "https://ui-avatars.com/api/?name=Sunita+Patel&background=f59e0b&color=fff&size=128",
//                 rating: 5,
//                 text: "What I love most is the transparency and tracking. We can show our donors exactly how many meals we've distributed. LeftoverChef has helped us build trust and expand our reach exponentially.",
//                 meals: "2,700+ meals"
//               },
//               {
//                 name: "David Wilson",
//                 organization: "Shelter Support Network",
//                 role: "Program Manager",
//                 image: "https://ui-avatars.com/api/?name=David+Wilson&background=3b82f6&color=fff&size=128",
//                 rating: 5,
//                 text: "The impact tracking and claim history features are incredible. We can generate reports for our stakeholders showing real data on our food rescue efforts. This platform is making hunger relief more efficient.",
//                 meals: "2,400+ meals"
//               }
//             ].map((testimonial, i) => (
//               <div key={i} className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-indigo-200 hover:-translate-y-2">
//                 <div className="flex items-start gap-4 mb-6">
//                   <img 
//                     src={testimonial.image} 
//                     alt={testimonial.name}
//                     className="w-16 h-16 rounded-full ring-4 ring-indigo-100 group-hover:ring-indigo-200 transition-all"
//                   />
//                   <div className="flex-1">
//                     <h4 className="font-bold text-gray-900 text-lg mb-1">{testimonial.name}</h4>
//                     <p className="text-sm text-indigo-600 font-semibold mb-1">{testimonial.organization}</p>
//                     <p className="text-xs text-gray-500">{testimonial.role}</p>
//                   </div>
//                 </div>

//                 <div className="flex gap-1 mb-4">
//                   {[...Array(testimonial.rating)].map((_, idx) => (
//                     <Star key={idx} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
//                   ))}
//                 </div>

//                 <p className="text-gray-600 leading-relaxed mb-6 italic">
//                   "{testimonial.text}"
//                 </p>

//                 <div className="pt-4 border-t border-gray-100">
//                   <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-full">
//                     <Heart className="w-4 h-4 text-indigo-600" />
//                     <span className="text-sm font-semibold text-indigo-700">{testimonial.meals} served</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Impact Stats */}
//           <div className="mt-16 bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-12">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
//               <div>
//                 <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
//                   98%
//                 </div>
//                 <div className="text-gray-600 font-medium">Satisfaction Rate</div>
//               </div>
//               <div>
//                 <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
//                   15K+
//                 </div>
//                 <div className="text-gray-600 font-medium">Meals Delivered</div>
//               </div>
//               <div>
//                 <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
//                   100+
//                 </div>
//                 <div className="text-gray-600 font-medium">Partner NGOs</div>
//               </div>
//               <div>
//                 <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
//                   24/7
//                 </div>
//                 <div className="text-gray-600 font-medium">Platform Uptime</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* CTA Section */}
//       <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
//         <div className="max-w-4xl mx-auto px-4 text-center">
//           <h2 className="text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
//           <p className="text-xl mb-8 text-white/90">Join our community of donors and NGOs today</p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Link
//               to="/register"
//               className="px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
//             >
//               Register as NGO
//             </Link>
//             <Link
//               to="/register"
//               className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full font-semibold hover:bg-white/20 transition-all"
//             >
//               Become a Donor
//             </Link>
//           </div>
//         </div>
//       </div>

//       {selectedListing && (
//         <ClaimModal
//           listing={selectedListing}
//           onClose={() => setSelectedListing(null)}
//           onSuccess={handleClaimSuccess}
//         />
//       )}
//     </>
//   );
// }
// src/pages/ListingsPage.jsx





























// import React, { useState } from "react";
// import { useListings } from "../hooks/useListings";
// import ClaimModal from "../components/ClaimModal";
// import { useQueryClient } from "@tanstack/react-query";
// import { api } from "../api/client";
// import { useAuth } from "../hooks/useAuth";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   Search,
//   MapPin,
//   Heart,
//   Clock,
//   TrendingUp,
//   Users,
//   Award,
//   Star,
//   Package,
// } from "lucide-react";

// export default function ListingsPage() {
//   const queryClient = useQueryClient();
//   // <-- changed status to "available" so frontend asks for real backend status
//   const { data, isLoading, isError } = useListings({ status: "available" });
//   const [selectedListing, setSelectedListing] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeFilter, setActiveFilter] = useState("all");
//   const { user, isAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   // DEBUG: log fetched data
//   console.log("ListingsPage: fetched data:", data);

//   const handleClaimSuccess = async (createdClaim) => {
//     try {
//       const listingId = createdClaim.listingId || createdClaim.listing || createdClaim.listing_id;
//       if (listingId) {
//         await api.patch(`/listings/${listingId}`, { status: "claimed" });
//       }
//       queryClient.invalidateQueries({ queryKey: ["listings"] });
//       queryClient.invalidateQueries({ queryKey: ["claims"] });
//       toast.success("Listing claimed successfully!");
//       setSelectedListing(null);
//     } catch (err) {
//       console.error("Failed to mark listing claimed:", err);
//       // toast.error("Failed to update listing status");
//     }
//   };

//   const onClaimClick = (listing) => {
//     if (!isAuthenticated) {
//       toast.info("Please log in as an NGO to claim donations.");
//       navigate("/login");
//       return;
//     }
//     if (user?.role !== "ngo") {
//       toast.warn("Only NGOs can claim donations.");
//       return;
//     }
//     setSelectedListing(listing);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="text-6xl mb-4">😔</div>
//           <h3 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
//           <p className="text-gray-600">Failed to load listings. Please try again.</p>
//         </div>
//       </div>
//     );
//   }

//   const filteredListings = (data || []) .filter(listing => listing.mlPrediction !== "spoiled").filter(listing => {
//     const matchesSearch = listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          listing.description?.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesSearch;
//   });

//   return (
//     <>
//       {/* Hero Section */}
//       <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden">
//         <div className="absolute inset-0 bg-black/20"></div>
//         <div className="absolute inset-0">
//           <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
//           <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
//         </div>
        
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
//           <div className="text-center">
//             <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
//               <Award className="w-4 h-4" />
//               <span className="text-sm font-medium">Connecting Communities • Fighting Hunger</span>
//             </div>
            
//             <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
//               Share Food,
//               <br />
//               <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
//                 Share Love
//               </span>
//             </h1>
            
//             <p className="text-lg lg:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
//               Join NGOs and donors in the fight against food waste. Every meal matters.
//             </p>
            
//             <div className="flex items-center justify-center gap-8 text-sm">
//               <div className="flex items-center gap-2">
//                 <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
//                   <Users className="w-5 h-5" />
//                 </div>
//                 <div className="text-left">
//                   <div className="font-bold text-lg">500+</div>
//                   <div className="text-white/80 text-xs">NGOs Active</div>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
//                   <Heart className="w-5 h-5" />
//                 </div>
//                 <div className="text-left">
//                   <div className="font-bold text-lg">10K+</div>
//                   <div className="text-white/80 text-xs">Meals Shared</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Search Bar */}
//       {/* <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10 mb-12">
//         <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-100">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
//               <Search className="w-5 h-5 text-gray-400" />
//               <input 
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search for food donations..."
//                 className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
//               />
//             </div>
//           </div>
//         </div>
//       </div> */}

//       {/* Stats Section */}
//       <div className="bg-gradient-to-br from-gray-50 to-indigo-50 py-12 mb-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {[{ icon: Heart, label: 'Meals Donated', value: '10,234', trend: '+12%' },
//               { icon: Users, label: 'Active NGOs', value: '523', trend: '+8%' },
//               { icon: TrendingUp, label: 'Waste Reduced', value: '5.2 Tons', trend: '+15%' },
//               { icon: Star, label: 'Success Rate', value: '98.5%', trend: '+2%' }
//             ].map((stat, i) => (
//               <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="p-3 bg-indigo-50 rounded-xl">
//                     <stat.icon className="w-6 h-6 text-indigo-600" />
//                   </div>
//                   <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
//                     {stat.trend}
//                   </span>
//                 </div>
//                 <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
//                 <div className="text-sm text-gray-500">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Listings */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
//         {/* Enhanced Section Header */}
//         <div className="relative mb-12">
//           <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
//             <div className="relative">
//               <div className="inline-block">
//                 <div className="flex items-center gap-4 mb-3">
//                   <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
//                     <Package className="w-7 h-7 text-white" />
//                   </div>
//                   <h2 className="text-4xl lg:text-5xl font-bold">
//                     <span className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
//                       Available Donations
//                     </span>
//                   </h2>
//                 </div>
//                 <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-full w-32"></div>
//               </div>
//               <p className="text-gray-600 text-lg mt-4 max-w-2xl">
//                 Fresh food ready to be shared with those in need. Every meal makes a difference.
//               </p>
//             </div>
            
//             <div className="flex gap-2 bg-white rounded-2xl p-1.5 shadow-lg border border-gray-200">
//               {['all', 'urgent', 'nearby'].map(tab => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveFilter(tab)}
//                   className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
//                     activeFilter === tab 
//                       ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md transform scale-105' 
//                       : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                   }`}
//                 >
//                   {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredListings.map((listing) => {
//             const lid = listing._id || listing.id || listing.listingId;
//             return (
//               <div key={lid} className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 hover:-translate-y-1">
//                 <div className="relative h-56 overflow-hidden">
//                   <img 
//                     src={listing.imageUrl || listing.images?.[0]?.url || "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop"}
//                     alt={listing.title}
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                   />
//                   <div className="absolute top-4 right-4">
//                     <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-indigo-600 shadow-lg">
//                       {listing.status}
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="p-6">
//                   <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
//                     {listing.title}
//                   </h3>
                  
//                   <p className="text-sm text-gray-600 mb-4 line-clamp-2">
//                     {listing.description}
//                   </p>
                  
//                   <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
//                     <div className="flex items-center gap-1">
//                       <MapPin className="w-4 h-4" />
//                       <span className="text-xs">{listing.pickupAddress || listing.pickup_address || "Location"}</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Clock className="w-4 h-4" />
//                       <span className="text-xs">Today</span>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center gap-3">
//                     <button
//                       onClick={() => onClaimClick(listing)}
//                       className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all hover:shadow-lg"
//                     >
//                       Claim Now
//                     </button>
//                     <Link
//                       to={`/listing/${lid}`}
//                       className="px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center"
//                     >
//                       <Heart className="w-5 h-5" />
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {filteredListings.length === 0 && (
//           <div className="text-center py-16">
//             <div className="text-6xl mb-4">🔍</div>
//             <h3 className="text-2xl font-bold text-gray-900 mb-2">No listings found</h3>
//             <p className="text-gray-600">Try adjusting your search or filters</p>
//           </div>
//         )}
//       </div>
//             {/* Testimonials Section */}
//       {/* <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <div className="inline-flex items-center gap-2 bg-indigo-100 px-4 py-2 rounded-full mb-4">
//               <Star className="w-5 h-5 text-indigo-600 fill-indigo-600" />
//               <span className="text-sm font-semibold text-indigo-700">Testimonials</span>
//             </div>
//             <h2 className="text-4xl lg:text-5xl font-bold mb-4">
//               <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
//                 Stories of Impact
//               </span>
//             </h2>
//             <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//               Hear from NGOs whose communities we've helped feed through our platform
//             </p>
//           </div> */}
//           Testimonials Section
//       <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <div className="inline-flex items-center gap-2 bg-indigo-100 px-4 py-2 rounded-full mb-4">
//               <Star className="w-5 h-5 text-indigo-600 fill-indigo-600" />
//               <span className="text-sm font-semibold text-indigo-700">Testimonials</span>
//             </div>
//             <h2 className="text-4xl lg:text-5xl font-bold mb-4">
//               <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
//                 Stories of Impact
//               </span>
//             </h2>
//             <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//               Hear from NGOs whose communities we've helped feed through our platform
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[
//               {
//                 name: "Priya Sharma",
//                 organization: "Helping Hands Foundation",
//                 role: "Director",
//                 image: "https://ui-avatars.com/api/?name=Priya+Sharma&background=4f46e5&color=fff&size=128",
//                 rating: 5,
//                 text: "LeftoverChef has been a game-changer for us. We've been able to feed over 500 families in the last month alone. The platform makes it so easy to connect with donors and coordinate pickups.",
//                 meals: "2,000+ meals"
//               },
//               {
//                 name: "Rajesh Kumar",
//                 organization: "Food For All NGO",
//                 role: "Coordinator",
//                 image: "https://ui-avatars.com/api/?name=Rajesh+Kumar&background=9333ea&color=fff&size=128",
//                 rating: 5,
//                 text: "The real-time notifications and easy claim process have streamlined our operations. We can now respond faster to food donations and ensure nothing goes to waste. Truly grateful for this platform!",
//                 meals: "1,500+ meals"
//               },
//               {
//                 name: "Anjali Desai",
//                 organization: "Community Kitchen Project",
//                 role: "Founder",
//                 image: "https://ui-avatars.com/api/?name=Anjali+Desai&background=ec4899&color=fff&size=128",
//                 rating: 5,
//                 text: "Before LeftoverChef, coordinating food donations was chaotic. Now, everything is organized and transparent. The impact on our community has been tremendous - we're feeding more people than ever!",
//                 meals: "3,200+ meals"
//               },
//               {
//                 name: "Mohammed Ali",
//                 organization: "Urban Relief Center",
//                 role: "Operations Head",
//                 image: "https://ui-avatars.com/api/?name=Mohammed+Ali&background=10b981&color=fff&size=128",
//                 rating: 5,
//                 text: "The platform's user-friendly interface makes it accessible even for our volunteers with limited tech experience. We've significantly reduced food waste in our area while helping more families.",
//                 meals: "1,800+ meals"
//               },
//               {
//                 name: "Sunita Patel",
//                 organization: "Hope Kitchen Initiative",
//                 role: "Managing Director",
//                 image: "https://ui-avatars.com/api/?name=Sunita+Patel&background=f59e0b&color=fff&size=128",
//                 rating: 5,
//                 text: "What I love most is the transparency and tracking. We can show our donors exactly how many meals we've distributed. LeftoverChef has helped us build trust and expand our reach exponentially.",
//                 meals: "2,700+ meals"
//               },
//               {
//                 name: "David Wilson",
//                 organization: "Shelter Support Network",
//                 role: "Program Manager",
//                 image: "https://ui-avatars.com/api/?name=David+Wilson&background=3b82f6&color=fff&size=128",
//                 rating: 5,
//                 text: "The impact tracking and claim history features are incredible. We can generate reports for our stakeholders showing real data on our food rescue efforts. This platform is making hunger relief more efficient.",
//                 meals: "2,400+ meals"
//               }
//             ].map((testimonial, i) => (
//               <div key={i} className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-indigo-200 hover:-translate-y-2">
//                 <div className="flex items-start gap-4 mb-6">
//                   <img 
//                     src={testimonial.image} 
//                     alt={testimonial.name}
//                     className="w-16 h-16 rounded-full ring-4 ring-indigo-100 group-hover:ring-indigo-200 transition-all"
//                   />
//                   <div className="flex-1">
//                     <h4 className="font-bold text-gray-900 text-lg mb-1">{testimonial.name}</h4>
//                     <p className="text-sm text-indigo-600 font-semibold mb-1">{testimonial.organization}</p>
//                     <p className="text-xs text-gray-500">{testimonial.role}</p>
//                   </div>
//                 </div>

//                 <div className="flex gap-1 mb-4">
//                   {[...Array(testimonial.rating)].map((_, idx) => (
//                     <Star key={idx} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
//                   ))}
//                 </div>

//                 <p className="text-gray-600 leading-relaxed mb-6 italic">
//                   "{testimonial.text}"
//                 </p>

//                 <div className="pt-4 border-t border-gray-100">
//                   <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-full">
//                     <Heart className="w-4 h-4 text-indigo-600" />
//                     <span className="text-sm font-semibold text-indigo-700">{testimonial.meals} served</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Impact Stats */}
//           <div className="mt-16 bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-12">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
//               <div>
//                 <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
//                   98%
//                 </div>
//                 <div className="text-gray-600 font-medium">Satisfaction Rate</div>
//               </div>
//               <div>
//                 <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
//                   15K+
//                 </div>
//                 <div className="text-gray-600 font-medium">Meals Delivered</div>
//               </div>
//               <div>
//                 <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
//                   100+
//                 </div>
//                 <div className="text-gray-600 font-medium">Partner NGOs</div>
//               </div>
//               <div>
//                 <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
//                   24/7
//                 </div>
//                 <div className="text-gray-600 font-medium">Platform Uptime</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>


//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[ /* testimonials array unchanged */ ].map((testimonial, i) => (
//               <div key={i} className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-indigo-200 hover:-translate-y-2">
//                 <div className="flex items-start gap-4 mb-6">
//                   <img 
//                     src={testimonial.image} 
//                     alt={testimonial.name}
//                     className="w-16 h-16 rounded-full ring-4 ring-indigo-100 group-hover:ring-indigo-200 transition-all"
//                   />
//                   <div className="flex-1">
//                     <h4 className="font-bold text-gray-900 text-lg mb-1">{testimonial.name}</h4>
//                     <p className="text-sm text-indigo-600 font-semibold mb-1">{testimonial.organization}</p>
//                     <p className="text-xs text-gray-500">{testimonial.role}</p>
//                   </div>
//                 </div>

//                 <div className="flex gap-1 mb-4">
//                   {[...Array(testimonial.rating)].map((_, idx) => (
//                     <Star key={idx} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
//                   ))}
//                 </div>

//                 <p className="text-gray-600 leading-relaxed mb-6 italic">
//                   "{testimonial.text}"
//                 </p>

//                 <div className="pt-4 border-t border-gray-100">
//                   <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-full">
//                     <Heart className="w-4 h-4 text-indigo-600" />
//                     <span className="text-sm font-semibold text-indigo-700">{testimonial.meals} served</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

        
         
        
    

//       {/* CTA Section */}
//       <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
//         <div className="max-w-4xl mx-auto px-4 text-center">
//           <h2 className="text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
//           <p className="text-xl mb-8 text-white/90">Join our community of donors and NGOs today</p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Link
//               to="/register"
//               className="px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
//             >
//               Register as NGO
//             </Link>
//             <Link
//               to="/register"
//               className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full font-semibold hover:bg-white/20 transition-all"
//             >
//               Become a Donor
//             </Link>
//           </div>
//         </div>
//       </div>

//       {selectedListing && (
//         <ClaimModal
//           listing={selectedListing}
//           onClose={() => setSelectedListing(null)}
//           onSuccess={handleClaimSuccess}
//         />
//       )}
//     </>
//   );
// }












// src/pages/ListingsPage.jsx
import React, { useState } from "react";
import { useListings } from "../hooks/useListings";
import ClaimModal from "../components/ClaimModal";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Search,
  MapPin,
  Heart,
  Clock,
  TrendingUp,
  Users,
  Award,
  Star,
  Package,
  Quote,
} from "lucide-react";

export default function ListingsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useListings({ status: "available" });
  const [selectedListing, setSelectedListing] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  console.log("ListingsPage: fetched data:", data);

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

  const filteredListings = (data || [])
    .filter(listing => listing.mlPrediction !== "spoiled")
    .filter(listing => {
      const matchesSearch = listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           listing.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

  const testimonials = [
    {
      name: "Priya Sharma",
      organization: "Helping Hands Foundation",
      role: "Director",
      rating: 5,
      text: "LeftoverChef has been a game-changer for us. We've been able to feed over 500 families in the last month alone. The platform makes it so easy to connect with donors and coordinate pickups.",
      meals: "2,000+ meals"
    },
    {
      name: "Rajesh Kumar",
      organization: "Food For All NGO",
      role: "Coordinator",
      rating: 5,
      text: "The real-time notifications and easy claim process have streamlined our operations. We can now respond faster to food donations and ensure nothing goes to waste. Truly grateful for this platform!",
      meals: "1,500+ meals"
    },
    {
      name: "Anjali Desai",
      organization: "Community Kitchen Project",
      role: "Founder",
      rating: 5,
      text: "Before LeftoverChef, coordinating food donations was chaotic. Now, everything is organized and transparent. The impact on our community has been tremendous - we're feeding more people than ever!",
      meals: "3,200+ meals"
    },
    {
      name: "Mohammed Ali",
      organization: "Urban Relief Center",
      role: "Operations Head",
      rating: 5,
      text: "The platform's user-friendly interface makes it accessible even for our volunteers with limited tech experience. We've significantly reduced food waste in our area while helping more families.",
      meals: "1,800+ meals"
    },
    {
      name: "Sunita Patel",
      organization: "Hope Kitchen Initiative",
      role: "Managing Director",
      rating: 5,
      text: "What I love most is the transparency and tracking. We can show our donors exactly how many meals we've distributed. LeftoverChef has helped us build trust and expand our reach exponentially.",
      meals: "2,700+ meals"
    },
    {
      name: "David Wilson",
      organization: "Shelter Support Network",
      role: "Program Manager",
      rating: 5,
      text: "The impact tracking and claim history features are incredible. We can generate reports for our stakeholders showing real data on our food rescue efforts. This platform is making hunger relief more efficient.",
      meals: "2,400+ meals"
    }
  ];

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
        <div className="relative mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="relative">
              <div className="inline-block">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Package className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold">
                    <span className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                      Available Donations
                    </span>
                  </h2>
                </div>
                <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-full w-32"></div>
              </div>
              <p className="text-gray-600 text-lg mt-4 max-w-2xl">
                Fresh food ready to be shared with those in need. Every meal makes a difference.
              </p>
            </div>
            
            <div className="flex gap-2 bg-white rounded-2xl p-1.5 shadow-lg border border-gray-200">
              {['all', 'urgent', 'nearby'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                    activeFilter === tab 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md transform scale-105' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => {
            const lid = listing._id || listing.id || listing.listingId;
            return (
              <div key={lid} className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 hover:-translate-y-1">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={listing.imageUrl || listing.images?.[0]?.url || "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop"}
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
                      <span className="text-xs">{listing.pickupAddress || listing.pickup_address || "Location"}</span>
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

      {/* Modern Testimonials Section */}
      <div className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-full mb-6 shadow-sm border border-indigo-100">
              <Star className="w-4 h-4 text-indigo-600 fill-indigo-600" />
              <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Testimonials
              </span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Stories of Impact
              </span>
            </h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
              Hear from NGOs whose communities we've helped feed through our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div 
                key={i} 
                className="group relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 hover:border-indigo-300/50 hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Quote className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="flex gap-0.5 mb-6">
                    {[...Array(testimonial.rating)].map((_, idx) => (
                      <Star key={idx} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  <p className="text-gray-700 text-base leading-relaxed mb-8">
                    "{testimonial.text}"
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{testimonial.name}</h4>
                      <p className="text-xs text-indigo-600 font-semibold">{testimonial.organization}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-full">
                      <Heart className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {testimonial.meals}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Impact Stats */}
          <div className="mt-16 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  98%
                </div>
                <div className="text-gray-600 font-medium">Satisfaction Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  15K+
                </div>
                <div className="text-gray-600 font-medium">Meals Delivered</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
                  100+
                </div>
                <div className="text-gray-600 font-medium">Partner NGOs</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  24/7
                </div>
                <div className="text-gray-600 font-medium">Platform Uptime</div>
              </div>
            </div>
          </div>
        </div>
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