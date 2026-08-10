"use client";

import { useState } from "react";
import { TalentHeader } from "@/app/components/talent/TalentHeader";
import { TalentSidebar } from "@/app/components/talent/TalentSidebar";

interface TalentShellProps {
  user: {
    name: string;
    email: string;
    image: string | null;
  };
  children: React.ReactNode;
}

export function TalentShell({ user, children }: TalentShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <TalentHeader sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} user={user} />
      <div className="flex">
        <TalentSidebar open={sidebarOpen} />
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
