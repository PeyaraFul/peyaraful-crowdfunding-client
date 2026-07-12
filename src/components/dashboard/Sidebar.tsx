"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiX } from "react-icons/hi";
import {
  FiHome,
  FiSearch,
  FiCreditCard,
  FiPlusCircle,
  FiList,
  FiDollarSign,
  FiUsers,
  FiFileText,
  FiFlag,
  FiShield,
} from "react-icons/fi";

interface SidebarProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

const supporterLinks = [
  { label: "Home", href: "/dashboard/supporter-home", icon: FiHome },
  { label: "Explore Campaigns", href: "/explore", icon: FiSearch },
  { label: "My Contributions", href: "/dashboard/supporter-home/contributions", icon: FiList },
  { label: "Purchase Credits", href: "/dashboard/supporter-home/purchase", icon: FiCreditCard },
  { label: "Payment History", href: "/dashboard/supporter-home/payments", icon: FiDollarSign },
];

const creatorLinks = [
  { label: "Home", href: "/dashboard/creator-home", icon: FiHome },
  { label: "Add Campaign", href: "/dashboard/creator-home/add-campaign", icon: FiPlusCircle },
  { label: "My Campaigns", href: "/dashboard/creator-home/my-campaigns", icon: FiList },
  { label: "Contributions", href: "/dashboard/creator-home/contributions", icon: FiCreditCard },
  { label: "Withdrawals", href: "/dashboard/creator-home/withdrawals", icon: FiDollarSign },
  { label: "Payment History", href: "/dashboard/creator-home/payments", icon: FiFileText },
];

const adminLinks = [
  { label: "Home", href: "/dashboard/admin-home", icon: FiHome },
  { label: "Campaign Approvals", href: "/dashboard/admin-home/approvals", icon: FiFlag },
  { label: "Withdrawal Requests", href: "/dashboard/admin-home/withdrawals", icon: FiDollarSign },
  { label: "Manage Users", href: "/dashboard/admin-home/users", icon: FiUsers },
  { label: "Manage Campaigns", href: "/dashboard/admin-home/campaigns", icon: FiList },
  { label: "Reports", href: "/dashboard/admin-home/reports", icon: FiShield },
];

export default function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const links =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "creator"
      ? creatorLinks
      : supporterLinks;

  return (
    <>
      {/* mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-peyara-accent
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* mobile close button */}
        <div className="flex items-center justify-between p-4 border-b border-peyara-accent lg:hidden">
          <span className="font-bold text-peyara-dark">Menu</span>
          <button onClick={onClose} className="text-gray-500 hover:text-peyara-dark">
            <HiX size={20} />
          </button>
        </div>

        {/* user info */}
        <div className="p-4 border-b border-peyara-accent">
          <div className="flex items-center gap-3">
            {user?.photo ? (
              <img
                src={user.photo}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-peyara-primary"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-peyara-primary flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-peyara-dark text-sm truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* links */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-140px)]">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-peyara-primary/20 text-peyara-dark"
                      : "text-gray-600 hover:bg-peyara-bg hover:text-peyara-dark"
                  }
                `}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
