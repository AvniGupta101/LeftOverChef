// // src/App.jsx
// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import ListingsPage from "./pages/ListingsPage";
// import MyClaims from "./pages/MyClaims";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ListingDetails from "./pages/ListingDetails";
// import Help from"./pages/help"

// export default function App() {
//   <div className="bg-background text-foreground p-6 rounded-xl shadow-glow animate-fadeIn">
//   ✅ Tailwind custom tokens are working!
// </div>

//   return (
    
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/20">
//       <Navbar />
//       <main>
//         <Routes>
//           <Route path="/" element={<ListingsPage />} />
//           <Route path="/my-claims" element={<MyClaims />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/listing/:id" element={<ListingDetails />} />
//           <Route path="/help" element={<Help />} />
//         </Routes>
//       </main>
//     </div>
//   );
// }
// src/App.jsx - Protected Route Example

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import ListingsPage from "./pages/ListingsPage";
import MyClaims from "./pages/MyClaims";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ListingDetails from "./pages/ListingDetails";
import Help from "./pages/Help";
import UploadListing from "./pages/UploadListing"; // New donor upload page
import ProfilePage from "./pages/ProfilePage";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";


// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
// Helper that redirects logged-in user to /profile/:id
function ProfileRedirect() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user._id) {
      navigate(`/profile/${user._id}`);
    } else {
      navigate("/login");
    }
  }, [user]);

  return null;
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/20">
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<ListingsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/listing/:id" element={<ListingDetails />} />
          <Route path="/help" element={<Help />} />

          {/* NGO Only Routes */}
          <Route
            path="/my-claims"
            element={
              <ProtectedRoute allowedRoles={["ngo"]}>
                <MyClaims />
              </ProtectedRoute>
            }
          />

          {/* Donor Only Routes */}
          <Route
            path="/donate"
            element={
              <ProtectedRoute allowedRoles={["donor"]}>
                <UploadListing />
              </ProtectedRoute>
            }
          />
          <Route path="/profile/:id" element={<ProfilePage />} />

<Route
  path="/profile/me"
  element={<ProfileRedirect />}
/>

          {/* Optional: My Listings page for donors to see their uploads */}
          <Route
            path="/my-listings"
            element={
              <ProtectedRoute allowedRoles={["donor"]}>
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold">My Listings</h2>
                  <p className="text-gray-600 mt-2">Your donation listings will appear here</p>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}


// Example: Redirect to /donate after donor login
// In your Login.jsx:
/*
async function handleSubmit(e) {
  e.preventDefault();
  const res = await login(email, password);
  if (res.success) {
    // Redirect based on role
    if (res.user.role === "donor") {
      navigate("/donate");
    } else if (res.user.role === "ngo") {
      navigate("/");
    } else {
      navigate("/");
    }
  } else {
    setError(res.message);
  }
}
*/