"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/providers/AuthContext";
import { FiDollarSign, FiList, FiCheckCircle } from "react-icons/fi";

export default function SupporterHome() {
  const { user } = useAuth();
  const [contributions, setContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/contributions/mine?page=1&limit=5")
      .then((res) => setContributions(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const approved = contributions.filter((c) => c.status === "approved");
  const pending = contributions.filter((c) => c.status === "pending");
  const totalContributed = approved.reduce((sum, c) => sum + c.amount, 0);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-peyara-dark mb-6">
        Welcome back, {user?.name}!
      </h1>

      {/* stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 border border-peyara-accent flex items-center gap-4">
          <div className="w-12 h-12 bg-peyara-primary/20 rounded-full flex items-center justify-center">
            <FiDollarSign size={24} className="text-peyara-dark" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Credits</p>
            <p className="text-2xl font-bold text-peyara-dark">{user?.credits || 0}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-peyara-accent flex items-center gap-4">
          <div className="w-12 h-12 bg-peyara-secondary/20 rounded-full flex items-center justify-center">
            <FiList size={24} className="text-peyara-secondary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Contributions</p>
            <p className="text-2xl font-bold text-peyara-dark">{contributions.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-peyara-accent flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <FiList size={24} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-peyara-dark">{pending.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-peyara-accent flex items-center gap-4">
          <div className="w-12 h-12 bg-peyara-primary/20 rounded-full flex items-center justify-center">
            <FiCheckCircle size={24} className="text-peyara-dark" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Approved Contributed</p>
            <p className="text-2xl font-bold text-peyara-dark">{totalContributed} cr</p>
          </div>
        </div>
      </div>

      {/* recent contributions */}
      <div className="bg-white rounded-xl border border-peyara-accent p-6">
        <h2 className="text-lg font-bold text-peyara-dark mb-4">Recent Contributions</h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-peyara-accent/20 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : contributions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-peyara-accent">
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Campaign</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Creator</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Amount</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {approved.map((c) => (
                  <tr key={c._id} className="border-b border-peyara-accent/50 hover:bg-peyara-bg/50">
                    <td className="py-3 px-2 font-medium text-peyara-dark truncate max-w-[200px]">
                      {c.campaign_title}
                    </td>
                    <td className="py-3 px-2 text-gray-600">{c.creator_name}</td>
                    <td className="py-3 px-2 font-semibold text-peyara-dark">{c.amount} cr</td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          c.status === "approved"
                            ? "bg-peyara-primary/20 text-peyara-dark"
                            : c.status === "rejected"
                            ? "bg-peyara-secondary/20 text-peyara-secondary"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-500">
                      {new Date(c.current_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">
            No contributions yet. <a href="/explore" className="text-peyara-primary underline">Explore campaigns</a>
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
