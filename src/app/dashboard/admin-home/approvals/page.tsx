"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";
import Link from "next/link";

export default function ApprovalsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/campaigns/pending")
      .then((res) => setCampaigns(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await axiosInstance.put(`/campaigns/${id}/status`, { status: "approved" });
      toast.success("Campaign approved!");
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await axiosInstance.put(`/campaigns/${id}/status`, { status: "rejected" });
      toast.success("Campaign rejected.");
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed.");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-peyara-dark mb-6">Campaign Approvals</h1>

      <div className="bg-white rounded-xl border border-peyara-accent p-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-peyara-accent/20 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : campaigns.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-peyara-accent">
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Title</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Creator</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Category</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Goal</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Deadline</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c._id} className="border-b border-peyara-accent/50 hover:bg-peyara-bg/50">
                    <td className="py-3 px-2 font-medium text-peyara-dark truncate max-w-[180px]">
                      <Link href={`/campaign/${c._id}`} className="hover:underline" target="_blank">
                        {c.title}
                      </Link>
                    </td>
                    <td className="py-3 px-2 text-gray-600">{c.creator_name}</td>
                    <td className="py-3 px-2 text-gray-600 capitalize">{c.category}</td>
                    <td className="py-3 px-2 font-semibold text-peyara-dark">{c.funding_goal} cr</td>
                    <td className="py-3 px-2 text-gray-500 text-xs">
                      {new Date(c.deadline).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(c._id)}
                          className="px-3 py-1 text-xs bg-peyara-primary text-peyara-dark rounded-lg hover:bg-peyara-dark hover:text-white transition font-medium"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(c._id)}
                          className="px-3 py-1 text-xs bg-peyara-secondary text-white rounded-lg hover:opacity-80 transition font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">No pending campaigns to review.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
