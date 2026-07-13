"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/providers/AuthContext";
import { toast } from "react-toastify";
import { FiCheckCircle, FiLoader } from "react-icons/fi";

function SuccessContent() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const credits = params.get("credits");
    const amount = params.get("amount");

    if (!sessionId || !credits || !amount) {
      setStatus("error");
      setErrorMsg("Invalid payment session.");
      return;
    }

    axiosInstance
      .post("/credits/purchase", {
        transactionId: sessionId,
        credits: Number(credits),
        amount: Number(amount),
      })
      .then((res) => {
        if (res.data.credits !== undefined && user) {
          setUser({ ...user, credits: res.data.credits });
        }
        setStatus("success");
        toast.success(`Successfully purchased ${credits} credits!`);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || "Failed to process payment.";
        setStatus("error");
        setErrorMsg(msg);
        toast.error(msg);
      });
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center py-16">
        {status === "loading" && (
          <>
            <FiLoader className="animate-spin text-peyara-primary mb-4" size={48} />
            <h1 className="text-xl font-bold text-peyara-dark">Processing your payment...</h1>
          </>
        )}

        {status === "success" && (
          <>
            <FiCheckCircle className="text-peyara-primary mb-4" size={64} />
            <h1 className="text-2xl font-bold text-peyara-dark mb-2">Payment Successful!</h1>
            <p className="text-gray-500 mb-6">Your credits have been added to your account.</p>
            <button
              onClick={() => router.push("/dashboard/supporter-home/purchase")}
              className="px-6 py-2.5 rounded-lg font-semibold bg-peyara-primary text-peyara-dark hover:bg-peyara-dark hover:text-white transition"
            >
              Back to Purchase
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-red-500 mb-2">Payment Failed</h1>
            <p className="text-gray-500 mb-6">{errorMsg || "Something went wrong processing your payment."}</p>
            <button
              onClick={() => router.push("/dashboard/supporter-home/purchase")}
              className="px-6 py-2.5 rounded-lg font-semibold bg-peyara-primary text-peyara-dark hover:bg-peyara-dark hover:text-white transition"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function PurchaseSuccessPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div className="flex flex-col items-center justify-center py-16">
            <FiLoader className="animate-spin text-peyara-primary mb-4" size={48} />
            <h1 className="text-xl font-bold text-peyara-dark">Loading...</h1>
          </div>
        </DashboardLayout>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
