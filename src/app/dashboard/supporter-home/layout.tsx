"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function SupporterLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={["supporter"]}>{children}</ProtectedRoute>;
}
