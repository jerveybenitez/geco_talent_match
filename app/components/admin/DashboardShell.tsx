"use client";

import { useState } from "react";
import { Header } from "@/app/components/admin/Header";
import { Sidebar } from "@/app/components/admin/Sidebar";

interface DashboardShellProps {
  user: {
    name: string;
    email: string;
    role: "superadmin" | "admin" | "user";
    image: string | null;
    countriesHandled: { countryCode: string }[];
  };
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} user={user} />
      <div className="flex">
        <Sidebar open={sidebarOpen} />
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
