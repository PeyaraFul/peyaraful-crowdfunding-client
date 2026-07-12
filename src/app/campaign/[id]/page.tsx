"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthContext";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";
import { FiCalendar, FiDollarSign, FiUser, FiAlertCircle } from "react-icons/fi";

export default function CampaignDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [contributing, setContributing] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`/campaigns/${id}`)
      .then((res) => setCampaign(res.data))
      .catch(() => toast.error("Campaign not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleContribute = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    const num = parseInt(amount);
    if (!num || num <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    setContributing(true);
    try {
      await axiosInstance.post("/contributions", {
        campaign_id: campaign._id,
        amount: num,
      });
      toast.success("Contribution submitted! Awaiting creator approval.");
      setAmount("");
      // refresh campaign
      const res = await axiosInstance.get(`/campaigns/${id}`);
      setCampaign(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Contribution failed.");
    } finally {
      setContributing(false);
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) {
      toast.error("Please enter a reason.");
      return;
    }
    try {
      await axiosInstance.post("/reports", {
        campaign_id: campaign._id,
        reason: reportReason,
      });
      toast.success("Report submitted.");
      setReportReason("");
      setShowReport(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Report failed.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-64 bg-peyara-accent/30 rounded-xl mb-6" />
        <div className="h-6 bg-peyara-accent/30 rounded w-1/2 mb-4" />
        <div className="h-4 bg-peyara-accent/30 rounded w-3/4" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Campaign not found.</p>
      </div>
    );
  }

  const progress = Math.min(
    (campaign.amount_raised / campaign.funding_goal) * 100,
    100
  );
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(campaign.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* image */}
      <div className="h-64 sm:h-80 bg-peyara-accent/30 rounded-xl overflow-hidden mb-6">
        {campaign.image_url ? (
          <img
            src={campaign.image_url}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">🎯</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* main info */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-peyara-accent/50 text-peyara-dark text-sm rounded-full font-medium capitalize">
              {campaign.category}
            </span>
            <span className="text-sm text-gray-500 capitalize">{campaign.status}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-peyara-dark mb-3">
            {campaign.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <span className="flex items-center gap-1">
              <FiUser /> {campaign.creator_name}
            </span>
            <span className="flex items-center gap-1">
              <FiCalendar /> {daysLeft} days left
            </span>
          </div>

          <div className="bg-white rounded-xl border border-peyara-accent p-6 mb-6">
            <h2 className="font-bold text-lg text-peyara-dark mb-3">Our Story</h2>
            <p className="text-gray-600 whitespace-pre-line leading-relaxed">
              {campaign.story}
            </p>
          </div>

          {campaign.reward_info && (
            <div className="bg-white rounded-xl border border-peyara-accent p-6 mb-6">
              <h2 className="font-bold text-lg text-peyara-dark mb-3">Rewards</h2>
              <p className="text-gray-600 whitespace-pre-line">{campaign.reward_info}</p>
            </div>
          )}

          {/* report */}
          {user?.role === "supporter" && (
            <div className="mt-4">
              {!showReport ? (
                <button
                  onClick={() => setShowReport(true)}
                  className="flex items-center gap-1 text-sm text-peyara-secondary hover:text-peyara-dark transition"
                >
                  <FiAlertCircle /> Report this campaign
                </button>
              ) : (
                <div className="bg-white rounded-xl border border-peyara-accent p-4">
                  <textarea
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Why are you reporting this campaign?"
                    className="w-full px-3 py-2 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-peyara-bg/50 text-sm"
                    rows={3}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleReport}
                      className="px-4 py-1.5 text-sm bg-peyara-secondary text-white rounded-lg hover:bg-peyara-primary transition"
                    >
                      Submit Report
                    </button>
                    <button
                      onClick={() => {
                        setShowReport(false);
                        setReportReason("");
                      }}
                      className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-peyara-accent p-6 sticky top-24">
            {/* progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-bold text-xl text-peyara-dark">
                  ${campaign.amount_raised.toLocaleString()}
                </span>
                <span className="text-gray-500 pt-1">
                  of ${campaign.funding_goal.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-peyara-bg rounded-full h-3 mb-2">
                <div
                  className="bg-peyara-primary h-3 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{progress.toFixed(0)}% funded</span>
                <span>{daysLeft} days left</span>
              </div>
            </div>

            {/* contribute form */}
            <div className="border-t border-peyara-accent pt-6">
              <h3 className="font-bold text-peyara-dark mb-3">Back this project</h3>
              <p className="text-sm text-gray-500 mb-3">
                Minimum contribution: {campaign.minimum_contribution} credits
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={campaign.minimum_contribution}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`${campaign.minimum_contribution} credits`}
                  className="flex-1 px-3 py-2 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-peyara-bg/50 text-sm"
                />
                <button
                  onClick={handleContribute}
                  disabled={contributing}
                  className="px-4 py-2 bg-peyara-primary text-peyara-dark rounded-lg hover:bg-peyara-dark hover:text-white transition disabled:opacity-50 font-semibold text-sm"
                >
                  {contributing ? "..." : "Back"}
                </button>
              </div>
              {!user && (
                <p className="text-xs text-peyara-secondary mt-2">
                  <a href="/login" className="underline">Login</a> to contribute
                </p>
              )}
            </div>

            {/* details */}
            <div className="border-t border-peyara-accent pt-6 mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 flex items-center gap-1"><FiDollarSign /> Min. Contribution</span>
                <span className="font-medium text-peyara-dark">{campaign.minimum_contribution} credits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 flex items-center gap-1"><FiCalendar /> Deadline</span>
                <span className="font-medium text-peyara-dark">
                  {new Date(campaign.deadline).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 flex items-center gap-1"><FiUser /> Creator</span>
                <span className="font-medium text-peyara-dark">{campaign.creator_name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
