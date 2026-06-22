"use client";

import AdminRoute from "@/features/auth/components/AdminRoute";
import { DashboardTopBar } from "@/features/admin/components/DashboardTopBar";
import { Sidebar } from "@/features/admin/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-slate-100/80 antialiased">
        <Sidebar />
        <div className="lg:ml-72 min-h-screen flex flex-col">
          <DashboardTopBar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AdminRoute>
  );
}
