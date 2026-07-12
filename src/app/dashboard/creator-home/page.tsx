"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/providers/AuthContext";

export default function CreatorHome() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["creator"]}>
      <DashboardLayout>
        <h1 className="text-2xl font-bold text-peyara-dark mb-4">
          Welcome back, {user?.name}!
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 border border-peyara-accent">
            <p className="text-sm text-gray-500">Your Credits</p>
            <p className="text-3xl font-bold text-peyara-dark">{user?.credits}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-peyara-accent">
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-3xl font-bold text-peyara-dark capitalize">{user?.role}</p>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
