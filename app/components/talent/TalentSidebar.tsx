"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlayCircle, User, TrendingUp, LayoutDashboard } from "lucide-react";
import { Button } from "../ui/button";

interface TalentSidebarProps {
  open: boolean;
  consultantId: string | null;
}

export function TalentSidebar({ open, consultantId }: TalentSidebarProps) {
  const pathname = usePathname();

  const navigationItems = [
    { href: "/talent/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: consultantId ? `/talent/profile/${consultantId}` : null, label: "My Profile", icon: User },
    // { href: "/talent/onboarding", label: "Onboarding", icon: PlayCircle },
    // { href: "/talent/performance", label: "Performance Review", icon: TrendingUp },
  ];

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
          const isActive = !!item.href && (pathname === item.href || pathname.startsWith(`${item.href}/`));
          return (
            <Button
              key={item.label}
              variant={isActive ? "default" : "ghost"}
              className="w-full justify-start"
              disabled={!item.href}
              asChild={!!item.href}
            >
              {item.href ? (
                <Link href={item.href}>
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              ) : (
                <span>
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </span>
              )}
            </Button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Welcome!</p>
          <p>Complete your profile and onboarding to get started.</p>
        </div>
      </div>
    </aside>
  );
}
