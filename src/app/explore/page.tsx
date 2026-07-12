"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { FiSearch } from "react-icons/fi";

export default function ExplorePage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = [
    "all",
    "technology",
    "art",
    "music",
    "film",
    "games",
    "education",
    "other",
  ];

  useEffect(() => {
    axiosInstance
      .get("/campaigns/approved")
      .then((res) => setCampaigns(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = campaigns.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.creator_name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || c.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center text-peyara-dark mb-2">
        Explore Campaigns
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Discover projects worth supporting
      </p>

      {/* filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search campaigns or creators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-white"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2.5 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-white"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md border border-peyara-accent p-4 animate-pulse">
              <div className="h-48 bg-peyara-accent/30 rounded-lg mb-4" />
              <div className="h-4 bg-peyara-accent/30 rounded w-3/4 mb-2" />
              <div className="h-3 bg-peyara-accent/30 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((campaign) => {
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
              <Link
                key={campaign._id}
                href={`/campaign/${campaign._id}`}
                className="bg-white rounded-xl shadow-md border border-peyara-accent overflow-hidden hover:shadow-lg transition"
              >
                <div className="h-48 bg-peyara-accent/30 flex items-center justify-center overflow-hidden">
                  {campaign.image_url ? (
                    <img
                      src={campaign.image_url}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">🎯</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-peyara-accent/50 text-peyara-dark text-xs rounded-full font-medium capitalize">
                      {campaign.category}
                    </span>
                    <span className="text-xs text-gray-500">{daysLeft} days left</span>
                  </div>
                  <h3 className="font-bold text-lg text-peyara-dark mb-1 truncate">
                    {campaign.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">by {campaign.creator_name}</p>
                  <div className="w-full bg-peyara-bg rounded-full h-2 mb-2">
                    <div
                      className="bg-peyara-primary h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-peyara-dark">
                      ${campaign.amount_raised.toLocaleString()}
                    </span>
                    <span className="text-gray-500">
                      of ${campaign.funding_goal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No campaigns found.</p>
          <p className="text-gray-400 text-sm mt-1">Try a different search or category.</p>
        </div>
      )}
    </div>
  );
}
