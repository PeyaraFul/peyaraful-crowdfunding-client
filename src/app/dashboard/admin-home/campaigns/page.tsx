"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/campaigns/all")
      .then((res) => setCampaigns(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete campaign "${title}"?`)) return;
    try {
      await axiosInstance.delete(`/campaigns/${id}`);
      toast.success("Campaign deleted.");
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed.");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-peyara-dark mb-6">Manage Campaigns</h1>

      <div className="bg-white rounded-xl border border-peyara-accent p-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-peyara-accent/20 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : campaigns.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-peyara-accent">
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Campaign</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Creator</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Category</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Raised</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Goal</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c._id} className="border-b border-peyara-accent/50 hover:bg-peyara-bg/50">
                    <td className="py-3 px-2 font-medium text-peyara-dark max-w-[180px] truncate">{c.title}</td>
                    <td className="py-3 px-2 text-gray-600">{c.creator_name}</td>
                    <td className="py-3 px-2 text-gray-600 capitalize">{c.category}</td>
                    <td className="py-3 px-2 font-semibold text-peyara-dark">${c.amount_raised}</td>
                    <td className="py-3 px-2 text-gray-600">${c.funding_goal}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                        c.status === "approved"
                          ? "bg-peyara-primary/20 text-peyara-dark"
                          : c.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-600"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => handleDelete(c._id, c.title)}
                        className="p-1.5 text-peyara-secondary hover:opacity-70 transition"
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">No campaigns found.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
