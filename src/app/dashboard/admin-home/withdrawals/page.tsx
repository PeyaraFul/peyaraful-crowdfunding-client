"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/withdrawals/pending")
      .then((res) => setWithdrawals(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await axiosInstance.put(`/withdrawals/${id}/approve`);
      toast.success("Withdrawal approved! Payment sent.");
      setWithdrawals((prev) => prev.filter((w) => w._id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed.");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-peyara-dark mb-6">Withdrawal Requests</h1>

      <div className="bg-white rounded-xl border border-peyara-accent p-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-peyara-accent/20 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : withdrawals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-peyara-accent">
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Creator</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Credits</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Amount (USD)</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Payment</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Account</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Date</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w._id} className="border-b border-peyara-accent/50 hover:bg-peyara-bg/50">
                    <td className="py-3 px-2 font-medium text-peyara-dark">{w.creator_name}</td>
                    <td className="py-3 px-2 font-semibold text-peyara-dark">{w.withdrawal_credit} cr</td>
                    <td className="py-3 px-2 font-semibold text-peyara-dark">${w.withdrawal_amount}</td>
                    <td className="py-3 px-2 text-gray-600 capitalize">{w.payment_system}</td>
                    <td className="py-3 px-2 text-gray-500 font-mono text-xs">{w.account_number}</td>
                    <td className="py-3 px-2 text-gray-500 text-xs">
                      {new Date(w.withdraw_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => handleApprove(w._id)}
                        className="px-4 py-1.5 text-xs bg-peyara-primary text-peyara-dark rounded-lg hover:bg-peyara-dark hover:text-white transition font-semibold"
                      >
                        Payment Success
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">No pending withdrawal requests.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
