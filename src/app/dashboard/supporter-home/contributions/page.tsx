"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import axiosInstance from "@/lib/axios";

export default function MyContributionsPage() {
  const [contributions, setContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchContributions = (p: number) => {
    setLoading(true);
    axiosInstance
      .get(`/contributions/mine?page=${p}&limit=5`)
      .then((res) => {
        setContributions(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchContributions(page);
  }, [page]);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-peyara-dark mb-6">My Contributions</h1>

      <div className="bg-white rounded-xl border border-peyara-accent p-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-peyara-accent/20 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : contributions.length > 0 ? (
          <>
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
                  {contributions.map((c) => (
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

            {/* pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-peyara-accent">
              <p className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm border border-peyara-accent rounded-lg hover:bg-peyara-bg transition disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-sm border border-peyara-accent rounded-lg hover:bg-peyara-bg transition disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-400 py-8">
            No contributions yet. <a href="/explore" className="text-peyara-primary underline">Explore campaigns</a>
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
