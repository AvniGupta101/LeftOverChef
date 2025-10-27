// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ListingsPage from "./pages/ListingsPage";
import MyClaims from "./pages/MyClaims";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ListingDetails from "./pages/ListingDetails";

export default function App() {
  <div className="bg-background text-foreground p-6 rounded-xl shadow-glow animate-fadeIn">
  ✅ Tailwind custom tokens are working!
</div>

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/20">
      <Navbar />
      <main>
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