"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function MyCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCampaign, setEditingCampaign] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    story: "",
    reward_info: "",
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = () => {
    setLoading(true);
    axiosInstance
      .get("/campaigns/mine")
      .then((res) => setCampaigns(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This will refund all approved contributions.`)) return;
    try {
      await axiosInstance.delete(`/campaigns/${id}`);
      toast.success("Campaign deleted.");
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete.");
    }
  };

  const openEdit = (campaign: any) => {
    setEditingCampaign(campaign);
    setEditForm({
      title: campaign.title,
      story: campaign.story,
      reward_info: campaign.reward_info || "",
    });
  };

  const handleUpdate = async () => {
    try {
      await axiosInstance.put(`/campaigns/${editingCampaign._id}`, editForm);
      toast.success("Campaign updated!");
      setEditingCampaign(null);
      fetchCampaigns();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update.");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-peyara-dark mb-6">My Campaigns</h1>

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
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Category</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Raised</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Goal</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c._id} className="border-b border-peyara-accent/50 hover:bg-peyara-bg/50">
                    <td className="py-3 px-2 font-medium text-peyara-dark truncate max-w-[200px]">
                      {c.title}
                    </td>
                    <td className="py-3 px-2 text-gray-600 capitalize">{c.category}</td>
                    <td className="py-3 px-2 font-semibold text-peyara-dark">{c.amount_raised} cr</td>
                    <td className="py-3 px-2 text-gray-600">{c.funding_goal} cr</td>
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
                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(c)}
                          className="p-1.5 text-peyara-primary hover:text-peyara-dark transition"
                          title="Edit"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(c._id, c.title)}
                          className="p-1.5 text-peyara-secondary hover:opacity-70 transition"
                          title="Delete"
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
          <p className="text-center text-gray-400 py-8">
            No campaigns yet. <a href="/dashboard/creator-home/add-campaign" className="text-peyara-primary underline">Create one</a>
          </p>
        )}
      </div>

      {/* edit modal */}
      {editingCampaign && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-peyara-dark mb-4">Edit Campaign</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-peyara-bg/50 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Story</label>
                <textarea
                  value={editForm.story}
                  onChange={(e) => setEditForm({ ...editForm, story: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-peyara-bg/50 text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reward Info</label>
                <textarea
                  value={editForm.reward_info}
                  onChange={(e) => setEditForm({ ...editForm, reward_info: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-peyara-bg/50 text-sm resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdate}
                className="flex-1 py-2 bg-peyara-primary text-peyara-dark rounded-lg hover:bg-peyara-dark hover:text-white transition font-semibold"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingCampaign(null)}
                className="flex-1 py-2 border border-peyara-accent rounded-lg hover:bg-peyara-bg transition text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
