"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";

const navigationItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/consultants", label: "Consultants", icon: Users },
  { href: "/admin/contracts", label: "Contracts", icon: FileText },
  { href: "/admin/performance", label: "Performance", icon: TrendingUp },
];

interface SidebarProps {
  open: boolean;
}

export function Sidebar({ open }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`
                  fixed lg:sticky top-[73px] left-0 h-[calc(100vh-73px)] bg-white border-r z-30
                  transition-transform duration-300 ease-in-out
                  ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                  w-64
                `}>
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.href}
              variant={isActive ? "default" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href={item.href}>
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}