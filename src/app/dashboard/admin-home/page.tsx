"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import axiosInstance from "@/lib/axios";
import { FiUsers, FiList, FiDollarSign, FiCreditCard } from "react-icons/fi";

export default function AdminHome() {
  const [stats, setStats] = useState({
    supporters: 0,
    creators: 0,
    campaigns: 0,
    totalCredits: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch users to count roles
    Promise.all([
      axiosInstance.get("/campaigns/all"),
    ])
      .then(([campRes]) => {
        const campaigns = campRes.data || [];
        setStats({
          supporters: 0,
          creators: 0,
          campaigns: campaigns.length,
          totalCredits: 0,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total Campaigns", value: stats.campaigns, icon: FiList, color: "bg-peyara-primary/20" },
    { label: "Supporters", value: stats.supporters, icon: FiUsers, color: "bg-peyara-secondary/20" },
    { label: "Creators", value: stats.creators, icon: FiUsers, color: "bg-peyara-primary/20" },
    { label: "Credits Issued", value: stats.totalCredits, icon: FiCreditCard, color: "bg-peyara-secondary/20" },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-peyara-dark mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl p-5 border border-peyara-accent flex items-center gap-3">
              <div className={`w-11 h-11 ${card.color} rounded-full flex items-center justify-center`}>
                <Icon size={22} className="text-peyara-dark" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{card.label}</p>
                <p className="text-xl font-bold text-peyara-dark">
                  {loading ? "..." : card.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-peyara-accent p-6">
        <h2 className="text-lg font-bold text-peyara-dark mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="/dashboard/admin-home/approvals"
            className="bg-peyara-bg/60 rounded-lg p-4 hover:shadow-md border border-peyara-accent transition text-center"
          >
            <p className="font-semibold text-peyara-dark">Campaign Approvals</p>
            <p className="text-xs text-gray-500 mt-1">Review pending campaigns</p>
          </a>
          <a
            href="/dashboard/admin-home/withdrawals"
            className="bg-peyara-bg/60 rounded-lg p-4 hover:shadow-md border border-peyara-accent transition text-center"
          >
            <p className="font-semibold text-peyara-dark">Withdrawal Requests</p>
            <p className="text-xs text-gray-500 mt-1">Process withdrawals</p>
          </a>
          <a
            href="/dashboard/admin-home/users"
            className="bg-peyara-bg/60 rounded-lg p-4 hover:shadow-md border border-peyara-accent transition text-center"
          >
            <p className="font-semibold text-peyara-dark">Manage Users</p>
            <p className="text-xs text-gray-500 mt-1">View and manage users</p>
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
