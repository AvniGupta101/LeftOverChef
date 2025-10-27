// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-300 flex items-center justify-center text-white font-bold">
                LC
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-800">LeftoverChef</div>
                <div className="text-xs text-gray-400 -mt-0.5">Connect donors & NGOs</div>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-800">Home</Link>
            <Link to="/my-claims" className="text-sm text-gray-600 hover:text-gray-800">My Claims</Link>
            {/* Add more links if needed */}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <div className="text-sm text-gray-700">Hi, <span className="font-medium">{user.name}</span></div>
                <button
                  onClick={() => logout()}
                  className="text-sm px-3 py-1 border border-gray-200 rounded text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-gray-800">Login</Link>
                <Link to="/register" className="text-sm px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">Register</Link>
              </>
            )}
          </div>

          {/* mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100"
              aria-expanded={open}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="md:hidden border-t">
          <div className="px-4 py-3 space-y-2">
            <Link to="/" onClick={() => setOpen(false)} className="block text-sm text-gray-700">Home</Link>
            <Link to="/my-claims" onClick={() => setOpen(false)} className="block text-sm text-gray-700">My Claims</Link>

            {user ? (
              <div className="pt-2 border-t">
                <div className="text-sm text-gray-700">Hi, <span className="font-medium">{user.name}</span></div>
                <button onClick={() => { setOpen(false); logout(); }} className="mt-2 w-full text-left px-3 py-2 rounded bg-red-50 text-red-600">Logout</button>
              </div>
            ) : (
              <div className="pt-2 border-t flex gap-2">
                <Link onClick={() => setOpen(false)} to="/login" className="text-sm text-gray-700">Login</Link>
                <Link onClick={() => setOpen(false)} to="/register" className="text-sm px-3 py-1 bg-indigo-600 text-white rounded">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
