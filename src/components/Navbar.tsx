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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-peyara-accent shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* logo */}
          <Link href="/" className="text-xl font-bold text-peyara-dark">
            Peyaraful Crowdfunding
          </Link>

          {/* desktop menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-peyara-primary transition font-medium">
              Home
            </Link>
            <Link href="/explore" className="text-gray-700 hover:text-peyara-primary transition font-medium">
              Explore Campaigns
            </Link>
            <a
              href="https://github.com/PeyaraFul/peyaraful-crowdfunding-client"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-peyara-primary transition flex items-center gap-1 font-medium"
            >
              <FiGithub size={18} />
              Join as Developer
            </a>

            {user ? (
              <div className="flex items-center gap-4 ml-2">
                <Link
                  href={getDashboardLink()}
                  className="text-gray-700 hover:text-peyara-primary transition font-medium"
                >
                  Dashboard
                </Link>
                <span className="px-3 py-1 text-xs font-semibold bg-peyara-primary/20 text-peyara-dark rounded-full">
                  {user.credits} Credits
                </span>
                <div className="flex items-center gap-2">
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-peyara-primary"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-peyara-primary flex items-center justify-center text-white text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm text-gray-600 hidden lg:block">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-1.5 text-sm bg-peyara-secondary text-white rounded-lg hover:bg-peyara-primary transition font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link
                  href="/login"
                  className="px-4 py-1.5 text-sm border border-peyara-secondary text-peyara-secondary rounded-lg hover:bg-peyara-secondary hover:text-white transition font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 text-sm bg-peyara-primary text-peyara-dark rounded-lg hover:bg-peyara-dark hover:text-white transition font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-peyara-dark hover:text-peyara-primary"
          >
            {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-peyara-accent shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700 hover:text-peyara-primary transition py-2 font-medium"
            >
              Home
            </Link>
            <Link
              href="/explore"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700 hover:text-peyara-primary transition py-2 font-medium"
            >
              Explore Campaigns
            </Link>
            <a
              href="https://github.com/PeyaraFul/peyaraful-crowdfunding-client"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-700 hover:text-peyara-primary transition py-2 font-medium"
            >
              <FiGithub size={18} />
              Join as Developer
            </a>

            <hr className="border-peyara-accent" />

            {user ? (
              <>
                <div className="flex items-center gap-2 py-2">
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-peyara-primary"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-peyara-primary flex items-center justify-center text-white text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm text-gray-600">{user.name}</span>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-peyara-primary/20 text-peyara-dark rounded-full ml-auto">
                    {user.credits} Credits
                  </span>
                </div>
                <Link
                  href={getDashboardLink()}
                  onClick={() => setMenuOpen(false)}
                  className="block text-gray-700 hover:text-peyara-primary transition py-2 font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm bg-peyara-secondary text-white rounded-lg hover:bg-peyara-primary transition font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 text-sm border border-peyara-secondary text-peyara-secondary rounded-lg hover:bg-peyara-secondary hover:text-white transition text-center font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 text-sm bg-peyara-primary text-peyara-dark rounded-lg hover:bg-peyara-dark hover:text-white transition text-center font-medium"
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
