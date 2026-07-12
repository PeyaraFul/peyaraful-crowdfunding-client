"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthContext";
import axiosInstance from "@/lib/axios";
import { HiMenu, HiBell } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";

interface DashboardHeaderProps {
  user: any;
  onMenuClick: () => void;
}

export default function DashboardHeader({ user, onMenuClick }: DashboardHeaderProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unread, setUnread] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.email) {
      axiosInstance
        .get(`/notifications/${user.email}`)
        .then((res) => {
          setNotifications(res.data);
          setUnread(res.data.length);
        })
        .catch(() => {});
    }
  }, [user?.email]);

  // close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="bg-white border-b border-peyara-accent px-4 sm:px-6 py-3 flex items-center justify-between">
      {/* left: hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-peyara-dark hover:text-peyara-primary"
        >
          <HiMenu size={24} />
        </button>
        <h2 className="text-lg font-bold text-peyara-dark hidden sm:block">
          Dashboard
        </h2>
      </div>

      {/* right: credits + notifications + logout */}
      <div className="flex items-center gap-4">
        {/* credits */}
        {user && (
          <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-peyara-bg rounded-full border border-peyara-accent">
            <span className="text-xs text-gray-500">Credits:</span>
            <span className="text-sm font-bold text-peyara-dark">{user.credits}</span>
          </div>
        )}

        {/* notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-gray-600 hover:text-peyara-primary transition"
          >
            <HiBell size={22} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-peyara-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-peyara-accent z-50 max-h-96 overflow-y-auto">
              <div className="p-3 border-b border-peyara-accent font-semibold text-peyara-dark text-sm">
                Notifications
              </div>
              {notifications.length === 0 ? (
                <p className="p-4 text-sm text-gray-400 text-center">No notifications yet</p>
              ) : (
                notifications.map((n, i) => (
                  <div
                    key={i}
                    className="px-3 py-2.5 border-b border-peyara-accent/50 hover:bg-peyara-bg/50 transition cursor-pointer"
                    onClick={() => {
                      if (n.actionRoute) router.push(n.actionRoute);
                      setShowNotifications(false);
                    }}
                  >
                    <p className="text-sm text-gray-700">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(n.time).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* logout */}
        <button
          onClick={handleLogout}
          className="text-gray-500 hover:text-peyara-secondary transition"
          title="Logout"
        >
          <FiLogOut size={20} />
        </button>
      </div>
    </header>
  );
}
