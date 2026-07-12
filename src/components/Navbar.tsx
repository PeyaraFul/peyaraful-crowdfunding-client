"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthContext";
import { HiMenu, HiX } from "react-icons/hi";
import { FiGithub } from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/dashboard/admin-home";
    if (user.role === "creator") return "/dashboard/creator-home";
    return "/dashboard/supporter-home";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* logo */}
          <Link href="/" className="text-xl font-bold text-blue-600">
            Peyaraful
          </Link>

          {/* desktop menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
              Home
            </Link>
            <Link href="/explore" className="text-gray-700 hover:text-blue-600 transition">
              Explore
            </Link>
            <a
              href="https://github.com/PeyaraFul"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-600 transition flex items-center gap-1"
            >
              <FiGithub size={18} />
              GitHub
            </a>

            {user ? (
              <div className="flex items-center gap-4 ml-2">
                <Link
                  href={getDashboardLink()}
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-2">
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm text-gray-600 hidden lg:block">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link
                  href="/login"
                  className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* mobile hamburger button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600"
          >
            {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700 hover:text-blue-600 transition py-2"
            >
              Home
            </Link>
            <Link
              href="/explore"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700 hover:text-blue-600 transition py-2"
            >
              Explore
            </Link>
            <a
              href="https://github.com/PeyaraFul"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition py-2"
            >
              <FiGithub size={18} />
              GitHub
            </a>

            <hr className="border-gray-200" />

            {user ? (
              <>
                <div className="flex items-center gap-2 py-2">
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm text-gray-600">{user.name}</span>
                </div>
                <Link
                  href={getDashboardLink()}
                  onClick={() => setMenuOpen(false)}
                  className="block text-gray-700 hover:text-blue-600 transition py-2"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition text-center"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
