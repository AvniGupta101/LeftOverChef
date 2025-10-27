// src/App.jsx
import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import ListingsPage from "./pages/ListingsPage";
import MyClaims from "./pages/MyClaims";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./hooks/useAuth";
import ListingDetails from "./pages/ListingDetails";


export default function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // return to home after logout
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4 flex justify-between max-w-6xl mx-auto">
        <div>
          <Link to="/" className="text-xl font-semibold text-indigo-700">
            LeftoverChef
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-gray-600">
            Home
          </Link>
          <Link to="/my-claims" className="text-sm text-gray-600">
            My Claims
          </Link>

          {user ? (
            <>
              <div className="text-sm text-gray-700">Hi, {user.name}</div>
              <button onClick={handleLogout} className="text-sm text-red-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600">
                Login
              </Link>
              <Link to="/register" className="text-sm text-gray-600">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="p-6 max-w-6xl mx-auto">
        <Routes>
          <Route path="/" element={<ListingsPage />} />
          <Route path="/my-claims" element={<MyClaims />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/listing/:id" element={<ListingDetails />} />
        </Routes>
      </main>
    </div>
  );
}
