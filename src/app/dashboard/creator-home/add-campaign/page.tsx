"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";

export default function AddCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    story: "",
    category: "technology",
    funding_goal: "",
    minimum_contribution: "",
    deadline: "",
    reward_info: "",
    image_url: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.story || !form.funding_goal || !form.deadline) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/campaigns", {
        ...form,
        funding_goal: parseInt(form.funding_goal),
        minimum_contribution: parseInt(form.minimum_contribution) || 1,
      });
      toast.success("Campaign created! Awaiting admin approval.");
      router.push("/dashboard/creator-home/my-campaigns");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create campaign.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-peyara-dark mb-6">Add New Campaign</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-peyara-accent p-6 max-w-3xl"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Title <span className="text-peyara-secondary">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-peyara-bg/50"
              placeholder="Enter campaign title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Story <span className="text-peyara-secondary">*</span>
            </label>
            <textarea
              name="story"
              value={form.story}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-2 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-peyara-bg/50 resize-none"
              placeholder="Tell people about your campaign..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-peyara-bg/50"
              >
                <option value="technology">Technology</option>
                <option value="art">Art</option>
                <option value="music">Music</option>
                <option value="film">Film</option>
                <option value="games">Games</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Funding Goal <span className="text-peyara-secondary">*</span>
              </label>
              <input
                name="funding_goal"
                type="number"
                value={form.funding_goal}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-peyara-bg/50"
                placeholder="e.g. 500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min. Contribution (credits)
              </label>
              <input
                name="minimum_contribution"
                type="number"
                value={form.minimum_contribution}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-peyara-bg/50"
                placeholder="Default: 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline <span className="text-peyara-secondary">*</span>
              </label>
              <input
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-peyara-bg/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reward Info</label>
            <textarea
              name="reward_info"
              value={form.reward_info}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-peyara-bg/50 resize-none"
              placeholder="Describe rewards for backers..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-peyara-bg/50"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-peyara-primary text-peyara-dark rounded-lg hover:bg-peyara-dark hover:text-white transition font-semibold disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Campaign"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 border border-peyara-accent rounded-lg hover:bg-peyara-bg transition text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
