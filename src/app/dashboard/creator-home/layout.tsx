"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={["creator"]}>{children}</ProtectedRoute>;
}
