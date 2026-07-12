"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";
import { FiDollarSign } from "react-icons/fi";

export default function WithdrawalsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paymentSystem, setPaymentSystem] = useState("paypal");
  const [accountNumber, setAccountNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axiosInstance
      .get("/campaigns/mine")
      .then((res) => setCampaigns(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalRaised = campaigns
    .filter((c) => c.status === "approved")
    .reduce((sum, c) => sum + c.amount_raised, 0);

  const earnableDollars = totalRaised / 20;

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const credits = parseInt(withdrawAmount);
    if (!credits || credits < 200) {
      toast.error("Minimum withdrawal is 200 credits ($10).");
      return;
    }
    if (credits > totalRaised) {
      toast.error("Insufficient raised credits.");
      return;
    }
    if (!accountNumber.trim()) {
      toast.error("Please enter your account number.");
      return;
    }

    setSubmitting(true);
    try {
      await axiosInstance.post("/withdrawals", {
        withdrawal_credit: credits,
        payment_system: paymentSystem,
        account_number: accountNumber,
      });
      toast.success("Withdrawal request submitted!");
      setWithdrawAmount("");
      setAccountNumber("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-peyara-dark mb-6 text-center">Withdrawals</h1>

      <div className="lg:grid lg:grid-cols-2 lg:gap-8">
        {/* earnings card */}
        <div className="bg-white rounded-xl border border-peyara-accent p-6 mb-6 lg:mb-0">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-peyara-primary/20 rounded-full flex items-center justify-center">
              <FiDollarSign size={28} className="text-peyara-dark" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Available to Withdraw</p>
              <p className="text-3xl font-bold text-peyara-dark">
                {totalRaised} credits
              </p>
              <p className="text-sm text-gray-500">
                ≈ ${earnableDollars.toFixed(2)} USD (20 credits = $1)
              </p>
            </div>
          </div>

          {/* info cards */}
          <div className="space-y-3">
            <div className="bg-peyara-bg/60 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Exchange Rate</p>
              <p className="font-semibold text-peyara-dark">20 credits = $1 USD</p>
            </div>
            <div className="bg-peyara-bg/60 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Minimum Withdrawal</p>
              <p className="font-semibold text-peyara-dark">200 credits ($10)</p>
            </div>
            <div className="bg-peyara-bg/60 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Estimated Earnings</p>
              <p className="font-semibold text-peyara-dark">${earnableDollars.toFixed(2)} USD</p>
            </div>
          </div>
        </div>

        {/* withdrawal form */}
        <div className="bg-white rounded-xl border border-peyara-accent p-6">
          <h2 className="text-lg font-bold text-peyara-dark mb-4">Request Withdrawal</h2>
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Credits to Withdraw
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min="200"
                className="w-full px-4 py-2.5 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-peyara-bg/50"
                placeholder="Minimum 200 credits"
              />
              {withdrawAmount && (
                <p className="text-xs text-peyara-primary mt-1">
                  You will receive: ${(parseInt(withdrawAmount) / 20).toFixed(2)} USD
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment System
              </label>
              <select
                value={paymentSystem}
                onChange={(e) => setPaymentSystem(e.target.value)}
                className="w-full px-4 py-2.5 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-peyara-bg/50"
              >
                <option value="paypal">PayPal</option>
                <option value="bank">Bank Transfer</option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number / Email
              </label>
              <input
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-peyara-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-peyara-bg/50"
                placeholder="Enter account details"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-peyara-primary text-peyara-dark rounded-lg hover:bg-peyara-dark hover:text-white transition font-semibold disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Request Withdrawal"}
            </button>
          </form>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}
