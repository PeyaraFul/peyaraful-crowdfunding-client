"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const loginUser = await login(email.trim(), password);

      if (loginUser) {
        const redirectMap: Record<string, string> = {
          supporter: "/dashboard/supporter-home",
          creator: "/dashboard/creator-home",
          admin: "/dashboard/admin-home",
        };
        router.push(redirectMap[loginUser.role] || "/");
        router.refresh();
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-peyara-accent bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-2xl font-bold text-peyara-dark">
          Welcome Back
        </h1>

        <p className="mb-6 text-center text-sm text-gray-600">
          Sign in to your Peyaraful Crowdfunding account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-gray-300 bg-peyara-bg/50 px-4 py-2.5 outline-none transition focus:border-peyara-primary focus:ring-2 focus:ring-peyara-primary disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-gray-300 bg-peyara-bg/50 px-4 py-2.5 outline-none transition focus:border-peyara-primary focus:ring-2 focus:ring-peyara-primary disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-peyara-primary py-2.5 font-semibold text-peyara-dark transition hover:bg-peyara-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-peyara-primary hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
