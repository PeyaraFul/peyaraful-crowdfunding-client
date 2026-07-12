"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/providers/AuthContext";
import { toast } from "react-toastify";
import { FiCreditCard, FiCheck } from "react-icons/fi";

const packages = [
  { credits: 100, price: 10, popular: false },
  { credits: 300, price: 25, popular: true },
  { credits: 800, price: 60, popular: false },
  { credits: 1500, price: 110, popular: false },
];

export default function PurchaseCreditsPage() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<number | null>(null);

  const handlePurchase = async (credits: number, price: number) => {
    setSelectedPkg(credits);
    setLoading(true);

    // simulate Stripe checkout success (client-side only)
    // in real app, this would open Stripe Checkout
    // for now, we call the API directly to simulate success
    try {
      const res = await axiosInstance.post("/credits/purchase", {
        amount: price,
        credits: credits,
        transactionId: "txn_" + Date.now(),
      });

      // update user credits
      if (res.data.credits !== undefined && user) {
        setUser({ ...user, credits: res.data.credits });
      }

      toast.success(`Successfully purchased ${credits} credits!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Purchase failed.");
    } finally {
      setLoading(false);
      setSelectedPkg(null);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-peyara-dark mb-2">Purchase Credits</h1>
      <p className="text-gray-500 mb-8">Current balance: <span className="font-bold text-peyara-dark">{user?.credits || 0} credits</span></p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.credits}
            className={`relative bg-white rounded-xl border-2 p-6 text-center transition hover:shadow-lg ${
              pkg.popular
                ? "border-peyara-primary shadow-md"
                : "border-peyara-accent"
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-peyara-primary text-peyara-dark text-xs font-bold rounded-full">
                Most Popular
              </span>
            )}

            <FiCreditCard className="mx-auto mb-3 text-peyara-primary" size={36} />

            <p className="text-3xl font-bold text-peyara-dark mb-1">
              {pkg.credits.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mb-4">credits</p>

            <p className="text-2xl font-bold text-peyara-dark mb-1">
              ${pkg.price}
            </p>
            <p className="text-xs text-gray-400 mb-6">
              ${((pkg.price / pkg.credits) * 100).toFixed(1)}¢ per credit
            </p>

            <ul className="text-left text-sm text-gray-600 space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <FiCheck size={14} className="text-peyara-primary" />
                {pkg.credits.toLocaleString()} credits
              </li>
              <li className="flex items-center gap-2">
                <FiCheck size={14} className="text-peyara-primary" />
                Instant activation
              </li>
              <li className="flex items-center gap-2">
                <FiCheck size={14} className="text-peyara-primary" />
                Back projects instantly
              </li>
            </ul>

            <button
              onClick={() => handlePurchase(pkg.credits, pkg.price)}
              disabled={loading}
              className={`w-full py-2.5 rounded-lg font-semibold transition disabled:opacity-50 ${
                pkg.popular
                  ? "bg-peyara-primary text-peyara-dark hover:bg-peyara-dark hover:text-white"
                  : "bg-peyara-bg text-peyara-dark hover:bg-peyara-primary border border-peyara-accent"
              }`}
            >
              {loading && selectedPkg === pkg.credits ? "Processing..." : `Buy for $${pkg.price}`}
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
