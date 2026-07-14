"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";
import { FiTrash2, FiSlash } from "react-icons/fi";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/reports")
      .then((res) => setReports(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm("Delete this campaign?")) return;
    try {
      await axiosInstance.delete(`/campaigns/${campaignId}`);
      toast.success("Campaign deleted.");
      setReports((prev) => prev.filter((r) => r.campaign_id !== campaignId));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed.");
    }
  };

  const handleSuspendCampaign = async (campaignId: string) => {
    if (!confirm("Suspend this campaign? It will be rejected and hidden.")) return;
    try {
      await axiosInstance.put(`/campaigns/${campaignId}/status`, { status: "rejected" });
      toast.success("Campaign suspended.");
      setReports((prev) => prev.filter((r) => r.campaign_id !== campaignId));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to suspend.");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-peyara-dark mb-6">Reported Campaigns</h1>

      <div className="bg-white rounded-xl border border-peyara-accent p-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-peyara-accent/20 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : reports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-peyara-accent">
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Reporter</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Campaign</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Reason</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Date</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r._id} className="border-b border-peyara-accent/50 hover:bg-peyara-bg/50">
                    <td className="py-3 px-2 font-medium text-peyara-dark">{r.reporter_name}</td>
                    <td className="py-3 px-2 text-gray-600">{r.campaign_title}</td>
                    <td className="py-3 px-2 text-gray-600 max-w-xs truncate">{r.reason}</td>
                    <td className="py-3 px-2 text-gray-500 text-xs">
                      {new Date(r.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleSuspendCampaign(r.campaign_id)}
                          className="p-1.5 text-yellow-600 hover:opacity-70 transition"
                          title="Suspend Campaign"
                        >
                          <FiSlash size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCampaign(r.campaign_id)}
                          className="p-1.5 text-peyara-secondary hover:opacity-70 transition"
                          title="Delete Campaign"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">No reports yet.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
