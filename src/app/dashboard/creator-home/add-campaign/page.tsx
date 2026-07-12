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
      <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-peyara-dark mb-6 text-center">Add New Campaign</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-peyara-accent p-6 lg:p-8"
      >
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* left column — main content */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Title <span className="text-peyara-secondary">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-peyara-bg/50"
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
                rows={10}
                className="w-full px-4 py-2.5 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-peyara-bg/50 resize-none"
                placeholder="Tell people about your campaign..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reward Info</label>
              <textarea
                name="reward_info"
                value={form.reward_info}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2.5 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-peyara-bg/50 resize-none"
                placeholder="Describe rewards for backers..."
              />
            </div>
          </div>

          {/* right column — settings */}
          <div className="lg:col-span-1 space-y-5 mt-5 lg:mt-0">
            <div className="bg-peyara-bg/60 rounded-xl border border-peyara-accent p-5 space-y-4">
              <h3 className="font-semibold text-peyara-dark text-sm">Campaign Settings</h3>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-white text-sm"
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
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Funding Goal <span className="text-peyara-secondary">*</span>
                </label>
                <input
                  name="funding_goal"
                  type="number"
                  value={form.funding_goal}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-white text-sm"
                  placeholder="e.g. 500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Min. Contribution (credits)
                </label>
                <input
                  name="minimum_contribution"
                  type="number"
                  value={form.minimum_contribution}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-white text-sm"
                  placeholder="Default: 1"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Deadline <span className="text-peyara-secondary">*</span>
                </label>
                <input
                  name="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Image URL</label>
                <input
                  name="image_url"
                  value={form.image_url}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-white text-sm"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 bg-peyara-primary text-peyara-dark rounded-lg hover:bg-peyara-dark hover:text-white transition font-semibold disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2.5 border border-peyara-accent rounded-lg hover:bg-peyara-bg transition text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
      </div>
    </DashboardLayout>
  );
}
