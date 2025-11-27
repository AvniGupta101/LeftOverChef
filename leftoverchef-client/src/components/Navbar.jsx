// // // src/components/Navbar.jsx
// // import React, { useState } from "react";
// // import { Link, useLocation } from "react-router-dom";
// // import { useAuth } from "../hooks/useAuth";
// // import { Home, FileText, LogIn, UserPlus, LogOut, Menu, X, Heart, User, ChevronDown } from "lucide-react";

// // export default function Navbar() {
// //   const [open, setOpen] = useState(false);
// //   const [profileOpen, setProfileOpen] = useState(false);
// //   const { user, logout } = useAuth();
// //   const location = useLocation();

// //   const isActive = (path) => location.pathname === path;

// //   const navLinks = [
// //     { path: "/", label: "Home", icon: Home },
// //     { path: "/my-claims", label: "My Claims", icon: FileText },
// //   ];

// //   return (
// //     <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //         <div className="flex justify-between items-center h-20">
// //           {/* Logo */}
// //           <Link to="/" className="flex items-center gap-3 group">
// //             <div className="relative">
// //               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
// //                 <Heart className="w-6 h-6 text-white" />
// //               </div>
// //               <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
// //             </div>
// //             <div className="hidden sm:block">
// //               <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
// //                 LeftoverChef
// //               </div>
// //               <div className="text-xs text-gray-500 font-medium -mt-1">Share Food, Share Love</div>
// //             </div>
// //           </Link>

// //           {/* Desktop Navigation */}
// //           <nav className="hidden md:flex items-center gap-2">
// //             {navLinks.map((link) => {
// //               const Icon = link.icon;
// //               return (
// //                 <Link
// //                   key={link.path}
// //                   to={link.path}
// //                   className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
// //                     isActive(link.path)
// //                       ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200"
// //                       : "text-gray-700 hover:bg-gray-100"
// //                   }`}
// //                 >
// //                   <Icon className="w-4 h-4" />
// //                   <span>{link.label}</span>
// //                 </Link>
// //               );
// //             })}
// //           </nav>

// //           {/* Desktop Auth Section */}
// //           <div className="hidden md:flex items-center gap-4">
// //             {user ? (
// //               <div className="relative">
// //                 <button
// //                   onClick={() => setProfileOpen(!profileOpen)}
// //                   className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-all"
// //                 >
// //                   <div className="flex items-center gap-3">
// //                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
// //                       {user.name?.charAt(0).toUpperCase()}
// //                     </div>
// //                     <div className="text-left">
// //                       <div className="text-sm font-semibold text-gray-900">{user.name}</div>
// //                       <div className="text-xs text-gray-500 capitalize">{user.role}</div>
// //                     </div>
// //                   </div>
// //                   <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
// //                 </button>

// //                 {/* Dropdown Menu */}
// //                 {profileOpen && (
// //                   <>
// //                     <div 
// //                       className="fixed inset-0 z-10" 
// //                       onClick={() => setProfileOpen(false)}
// //                     ></div>
// //                     <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-20 animate-fadeIn">
// //                       <div className="px-4 py-3 border-b border-gray-100">
// //                         <div className="text-sm font-semibold text-gray-900">{user.name}</div>
// //                         <div className="text-xs text-gray-500">{user.email}</div>
// //                       </div>
                      
// //                       <div className="py-2">
// //                         <Link
// //                           to="/my-claims"
// //                           onClick={() => setProfileOpen(false)}
// //                           className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
// //                         >
// //                           <FileText className="w-4 h-4" />
// //                           <span>My Claims</span>
// //                         </Link>
// //                       </div>

// //                       <div className="border-t border-gray-100 pt-2">
// //                         <button
// //                           onClick={() => {
// //                             setProfileOpen(false);
// //                             logout();
// //                           }}
// //                           className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
// //                         >
// //                           <LogOut className="w-4 h-4" />
// //                           <span>Logout</span>
// //                         </button>
// //                       </div>
// //                     </div>
// //                   </>
// //                 )}
// //               </div>
// //             ) : (
// //               <div className="flex items-center gap-3">
// //                 <Link
// //                   to="/login"
// //                   className="flex items-center gap-2 px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium transition-colors"
// //                 >
// //                   <LogIn className="w-4 h-4" />
// //                   <span>Login</span>
// //                 </Link>
// //                 <Link
// //                   to="/register"
// //                   className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl"
// //                 >
// //                   <UserPlus className="w-4 h-4" />
// //                   <span>Register</span>
// //                 </Link>
// //               </div>
// //             )}
// //           </div>

// //           {/* Mobile menu button */}
// //           <button
// //             onClick={() => setOpen(!open)}
// //             className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
// //           >
// //             {open ? (
// //               <X className="w-6 h-6 text-gray-700" />
// //             ) : (
// //               <Menu className="w-6 h-6 text-gray-700" />
// //             )}
// //           </button>
// //         </div>
// //       </div>

// //       {/* Mobile Menu */}
// //       {open && (
// //         <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl animate-fadeIn">
// //           <div className="px-4 py-6 space-y-1">
// //             {/* Mobile Navigation Links */}
// //             {navLinks.map((link) => {
// //               const Icon = link.icon;
// //               return (
// //                 <Link
// //                   key={link.path}
// //                   to={link.path}
// //                   onClick={() => setOpen(false)}
// //                   className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
// //                     isActive(link.path)
// //                       ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
// //                       : "text-gray-700 hover:bg-gray-100"
// //                   }`}
// //                 >
// //                   <Icon className="w-5 h-5" />
// //                   <span>{link.label}</span>
// //                 </Link>
// //               );
// //             })}

// //             {/* Mobile Auth Section */}
// //             {user ? (
// //               <div className="pt-4 mt-4 border-t border-gray-100 space-y-3">
// //                 <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
// //                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
// //                     {user.name?.charAt(0).toUpperCase()}
// //                   </div>
// //                   <div>
// //                     <div className="text-sm font-semibold text-gray-900">{user.name}</div>
// //                     <div className="text-xs text-gray-600 capitalize">{user.role}</div>
// //                   </div>
// //                 </div>
                
// //                 <button
// //                   onClick={() => {
// //                     setOpen(false);
// //                     logout();
// //                   }}
// //                   className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors rounded-xl w-full font-medium"
// //                 >
// //                   <LogOut className="w-5 h-5" />
// //                   <span>Logout</span>
// //                 </button>
// //               </div>
// //             ) : (
// //               <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
// //                 <Link
// //                   to="/login"
// //                   onClick={() => setOpen(false)}
// //                   className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors rounded-xl font-medium"
// //                 >
// //                   <LogIn className="w-5 h-5" />
// //                   <span>Login</span>
// //                 </Link>
// //                 <Link
// //                   to="/register"
// //                   onClick={() => setOpen(false)}
// //                   className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
// //                 >
// //                   <UserPlus className="w-5 h-5" />
// //                   <span>Register</span>
// //                 </Link>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </header>
// //   );
// // }
// // src/components/Navbar.jsx
// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import { Home, FileText, LogIn, UserPlus, LogOut, Menu, X, Heart, User, ChevronDown, HelpCircle, Settings } from "lucide-react";
// import { toast } from "react-toastify";

// export default function Navbar() {
//   const [open, setOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const { user, logout } = useAuth();
//   const location = useLocation();

//   const isActive = (path) => location.pathname === path;

//   const navLinks = [
//     { path: "/", label: "Home", icon: Home },
//     { path: "/my-claims", label: "My Claims", icon: FileText },
//   ];

//   return (
//     <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-20">
//           {/* Logo */}
//           <Link to="/" className="flex items-center gap-3 group">
//             <div className="relative">
//               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
//                 <Heart className="w-6 h-6 text-white" />
//               </div>
//               <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
//             </div>
//             <div className="hidden sm:block">
//               <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
//                 LeftoverChef
//               </div>
//               <div className="text-xs text-gray-500 font-medium -mt-1">Share Food, Share Love</div>
//             </div>
//           </Link>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center gap-2">
//             {navLinks.map((link) => {
//               const Icon = link.icon;
//               return (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
//                     isActive(link.path)
//                       ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200"
//                       : "text-gray-700 hover:bg-gray-100"
//                   }`}
//                 >
//                   <Icon className="w-4 h-4" />
//                   <span>{link.label}</span>
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* Desktop Auth Section */}
//           <div className="hidden md:flex items-center gap-4">
//             {user ? (
//               <div className="relative">
//                 <button
//                   onClick={() => setProfileOpen(!profileOpen)}
//                   className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-all"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
//                       {user.name?.charAt(0).toUpperCase()}
//                     </div>
//                     <div className="text-left">
//                       <div className="text-sm font-semibold text-gray-900">{user.name}</div>
//                       <div className="text-xs text-gray-500 capitalize">{user.role}</div>
//                     </div>
//                   </div>
//                   <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
//                 </button>

//                 {/* Dropdown Menu */}
//                 {profileOpen && (
//                   <>
//                     <div 
//                       className="fixed inset-0 z-10" 
//                       onClick={() => setProfileOpen(false)}
//                     ></div>
//                     <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-20 animate-fadeIn">
//                       <div className="px-4 py-3 border-b border-gray-100">
//                         <div className="text-sm font-semibold text-gray-900">{user.name}</div>
//                         <div className="text-xs text-gray-500">{user.email}</div>
//                       </div>
                      
//                       <div className="py-2">
//                         <Link
//                           to="/my-claims"
//                           onClick={() => setProfileOpen(false)}
//                           className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                         >
//                           <FileText className="w-4 h-4" />
//                           <span>My Claims</span>
//                         </Link>
                        
//                         <button
//                           onClick={() => {
//                             setProfileOpen(false);
//                             toast.info("Need help? Contact us at support@leftoverchef.com or call 1-800-FOOD-HELP");
//                           }}
//                           className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full"
//                         >
//                           <HelpCircle className="w-4 h-4" />
//                           <span>Help & Support</span>
//                         </button>
//                       </div>

//                       <div className="border-t border-gray-100 pt-2">
//                         <button
//                           onClick={() => {
//                             setProfileOpen(false);
//                             logout();
//                           }}
//                           className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
//                         >
//                           <LogOut className="w-4 h-4" />
//                           <span>Logout</span>
//                         </button>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             ) : (
//               <div className="flex items-center gap-3">
//                 <Link
//                   to="/login"
//                   className="flex items-center gap-2 px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium transition-colors"
//                 >
//                   <LogIn className="w-4 h-4" />
//                   <span>Login</span>
//                 </Link>
//                 <Link
//                   to="/register"
//                   className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl"
//                 >
//                   <UserPlus className="w-4 h-4" />
//                   <span>Register</span>
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <button
//             onClick={() => setOpen(!open)}
//             className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
//           >
//             {open ? (
//               <X className="w-6 h-6 text-gray-700" />
//             ) : (
//               <Menu className="w-6 h-6 text-gray-700" />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {open && (
//         <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl animate-fadeIn">
//           <div className="px-4 py-6 space-y-1">
//             {/* Mobile Navigation Links */}
//             {navLinks.map((link) => {
//               const Icon = link.icon;
//               return (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   onClick={() => setOpen(false)}
//                   className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
//                     isActive(link.path)
//                       ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
//                       : "text-gray-700 hover:bg-gray-100"
//                   }`}
//                 >
//                   <Icon className="w-5 h-5" />
//                   <span>{link.label}</span>
//                 </Link>
//               );
//             })}

//             {/* Mobile Auth Section */}
//             {user ? (
//               <div className="pt-4 mt-4 border-t border-gray-100 space-y-3">
//                 <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
//                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
//                     {user.name?.charAt(0).toUpperCase()}
//                   </div>
//                   <div>
//                     <div className="text-sm font-semibold text-gray-900">{user.name}</div>
//                     <div className="text-xs text-gray-600 capitalize">{user.role}</div>
//                   </div>
//                 </div>
                
//                 <button
//                   onClick={() => {
//                     setOpen(false);
//                     toast.info("Need help? Contact us at support@leftoverchef.com or call 1-800-FOOD-HELP");
//                   }}
//                   className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors rounded-xl w-full font-medium"
//                 >
//                   <HelpCircle className="w-5 h-5" />
//                   <span>Help & Support</span>
//                 </button>
                
//                 <button
//                   onClick={() => {
//                     setOpen(false);
//                     logout();
//                   }}
//                   className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors rounded-xl w-full font-medium"
//                 >
//                   <LogOut className="w-5 h-5" />
//                   <span>Logout</span>
//                 </button>
//               </div>
//             ) : (
//               <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
//                 <Link
//                   to="/login"
//                   onClick={() => setOpen(false)}
//                   className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors rounded-xl font-medium"
//                 >
//                   <LogIn className="w-5 h-5" />
//                   <span>Login</span>
//                 </Link>
//                 <Link
//                   to="/register"
//                   onClick={() => setOpen(false)}
//                   className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
//                 >
//                   <UserPlus className="w-5 h-5" />
//                   <span>Register</span>
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }
// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Home, FileText, LogIn, UserPlus, LogOut, Menu, X, Heart, User, ChevronDown, HelpCircle, Settings } from "lucide-react";
import { toast } from "react-toastify";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/my-claims", label: "My Claims", icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                LeftoverChef
              </div>
              <div className="text-xs text-gray-500 font-medium -mt-1">Share Food, Share Love</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                    isActive(link.path)
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {profileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setProfileOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-20 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          to="/my-claims"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          <span>My Claims</span>
                        </Link>
                         <Link
                          to="/donate"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Donate</span>
                        </Link>
                        <Link
                          to="/help"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <HelpCircle className="w-4 h-4" />
                          <span>Help & Support</span>
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {open ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl animate-fadeIn">
          <div className="px-4 py-6 space-y-1">
            {/* Mobile Navigation Links */}
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive(link.path)
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Mobile Auth Section */}
            {user ? (
              <div className="pt-4 mt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-600 capitalize">{user.role}</div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setOpen(false);
                    toast.info("Need help? Contact us at support@leftoverchef.com or call 1-800-FOOD-HELP");
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors rounded-xl w-full font-medium"
                >
                  <HelpCircle className="w-5 h-5" />
                  <span>Help & Support</span>
                </button>
                
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors rounded-xl w-full font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors rounded-xl font-medium"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}