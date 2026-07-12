"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/providers/AuthContext";
import { toast } from "react-toastify";
import { FiList, FiCheckCircle, FiDollarSign, FiClock } from "react-icons/fi";

export default function CreatorHome() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContrib, setSelectedContrib] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      axiosInstance.get("/campaigns/mine"),
      axiosInstance.get("/contributions/pending"),
    ])
      .then(([campRes, contribRes]) => {
        setCampaigns(campRes.data);
        setPending(contribRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeCampaigns = campaigns.filter((c) => c.status === "approved");
  const totalRaised = campaigns.reduce((sum, c) => sum + c.amount_raised, 0);

  const handleApprove = async (id: string) => {
    try {
      await axiosInstance.put(`/contributions/${id}/approve`);
      toast.success("Contribution approved!");
      const approvedContrib = pending.find((c) => c._id === id);
      setPending((prev) => prev.filter((c) => c._id !== id));
      if (approvedContrib) {
        setCampaigns((prev) =>
          prev.map((c) =>
            c._id === approvedContrib.campaign_id
              ? { ...c, amount_raised: c.amount_raised + approvedContrib.amount }
              : c
          )
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await axiosInstance.put(`/contributions/${id}/reject`);
      toast.success("Contribution rejected. Credits refunded.");
      setPending((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed.");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-peyara-dark mb-6">
        Welcome back, {user?.name}!
      </h1>

      {/* stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-peyara-accent flex items-center gap-3">
          <div className="w-11 h-11 bg-peyara-primary/20 rounded-full flex items-center justify-center">
            <FiList size={22} className="text-peyara-dark" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Campaigns</p>
            <p className="text-xl font-bold text-peyara-dark">{campaigns.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-peyara-accent flex items-center gap-3">
          <div className="w-11 h-11 bg-peyara-primary/20 rounded-full flex items-center justify-center">
            <FiCheckCircle size={22} className="text-peyara-dark" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Active Campaigns</p>
            <p className="text-xl font-bold text-peyara-dark">{activeCampaigns.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-peyara-accent flex items-center gap-3">
          <div className="w-11 h-11 bg-peyara-secondary/20 rounded-full flex items-center justify-center">
            <FiDollarSign size={22} className="text-peyara-secondary" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Raised</p>
            <p className="text-xl font-bold text-peyara-dark">{totalRaised} cr</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-peyara-accent flex items-center gap-3">
          <div className="w-11 h-11 bg-yellow-100 rounded-full flex items-center justify-center">
            <FiClock size={22} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Pending Reviews</p>
            <p className="text-xl font-bold text-peyara-dark">{pending.length}</p>
          </div>
        </div>
      </div>

      {/* pending contributions */}
      <div className="bg-white rounded-xl border border-peyara-accent p-6">
        <h2 className="text-lg font-bold text-peyara-dark mb-4">Pending Contributions</h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-peyara-accent/20 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : pending.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-peyara-accent">
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Campaign</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Supporter</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Amount</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Date</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((c) => (
                  <tr key={c._id} className="border-b border-peyara-accent/50 hover:bg-peyara-bg/50">
                    <td className="py-3 px-2 font-medium text-peyara-dark truncate max-w-[180px]">
                      {c.campaign_title}
                    </td>
                    <td className="py-3 px-2 text-gray-600">{c.supporter_name}</td>
                    <td className="py-3 px-2 font-semibold text-peyara-dark">{c.amount} cr</td>
                    <td className="py-3 px-2 text-gray-500 text-xs">
                      {new Date(c.current_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedContrib(c)}
                          className="px-3 py-1 text-xs bg-peyara-bg border border-peyara-accent rounded-lg hover:bg-peyara-accent/30 transition"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleApprove(c._id)}
                          className="px-3 py-1 text-xs bg-peyara-primary text-peyara-dark rounded-lg hover:bg-peyara-dark hover:text-white transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(c._id)}
                          className="px-3 py-1 text-xs bg-peyara-secondary text-white rounded-lg hover:opacity-80 transition"
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
          <p className="text-center text-gray-400 py-8">No pending contributions.</p>
        )}
      </div>

      {/* detail modal */}
      {selectedContrib && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-peyara-dark mb-4">Contribution Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Campaign</span>
                <span className="font-medium text-peyara-dark">{selectedContrib.campaign_title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Supporter</span>
                <span className="font-medium text-peyara-dark">{selectedContrib.supporter_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-peyara-dark">{selectedContrib.amount} credits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-medium text-peyara-dark">
                  {new Date(selectedContrib.current_date).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                  {selectedContrib.status}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  handleApprove(selectedContrib._id);
                  setSelectedContrib(null);
                }}
                className="flex-1 py-2 bg-peyara-primary text-peyara-dark rounded-lg hover:bg-peyara-dark hover:text-white transition font-semibold"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  handleReject(selectedContrib._id);
                  setSelectedContrib(null);
                }}
                className="flex-1 py-2 bg-peyara-secondary text-white rounded-lg hover:opacity-80 transition font-semibold"
              >
                Reject
              </button>
            </div>

            <button
              onClick={() => setSelectedContrib(null)}
              className="w-full mt-3 py-2 border border-peyara-accent rounded-lg hover:bg-peyara-bg transition text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
