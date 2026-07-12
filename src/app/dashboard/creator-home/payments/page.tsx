"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import axiosInstance from "@/lib/axios";

export default function CreatorPaymentsPage() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/withdrawals/history")
      .then((res) => setWithdrawals(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-peyara-dark mb-6">Withdrawal History</h1>

      <div className="bg-white rounded-xl border border-peyara-accent p-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-peyara-accent/20 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : withdrawals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-peyara-accent">
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Date</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Credits</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Amount (USD)</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Payment System</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Account</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w._id} className="border-b border-peyara-accent/50 hover:bg-peyara-bg/50">
                    <td className="py-3 px-2 text-gray-600">
                      {new Date(w.withdraw_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 font-semibold text-peyara-dark">{w.withdrawal_credit} cr</td>
                    <td className="py-3 px-2 font-semibold text-peyara-dark">${w.withdrawal_amount}</td>
                    <td className="py-3 px-2 text-gray-600 capitalize">{w.payment_system}</td>
                    <td className="py-3 px-2 text-gray-500 font-mono text-xs">{w.account_number}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          w.status === "approved"
                            ? "bg-peyara-primary/20 text-peyara-dark"
                            : w.status === "rejected"
                            ? "bg-peyara-secondary/20 text-peyara-secondary"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">
            No withdrawals yet. <a href="/dashboard/creator-home/withdrawals" className="text-peyara-primary underline">Request one</a>
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
