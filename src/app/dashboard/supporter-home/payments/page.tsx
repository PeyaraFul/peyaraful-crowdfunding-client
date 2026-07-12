"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import axiosInstance from "@/lib/axios";

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/payments/history")
      .then((res) => setPayments(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-peyara-dark mb-6">Payment History</h1>

      <div className="bg-white rounded-xl border border-peyara-accent p-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-peyara-accent/20 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-peyara-accent">
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Date</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Amount</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Credits</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id} className="border-b border-peyara-accent/50 hover:bg-peyara-bg/50">
                    <td className="py-3 px-2 text-gray-600">
                      {new Date(p.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 font-semibold text-peyara-dark">${p.amount}</td>
                    <td className="py-3 px-2 text-peyara-dark">{p.credits} cr</td>
                    <td className="py-3 px-2 text-gray-500 font-mono text-xs">{p.transactionId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">
            No payments yet. <a href="/dashboard/supporter-home/purchase" className="text-peyara-primary underline">Purchase credits</a>
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
