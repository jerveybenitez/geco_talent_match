"use client";

import { useRouter } from "next/navigation";
import { Menu, X, ChevronDown, Settings, LogOut, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Header({ sidebarOpen, onToggleSidebar }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/logged-out");
    router.refresh();
  };

  return (
    
    <header className="bg-[#1D2033] border-b border-[#2a2f5b] sticky top-0 z-40 shadow-lg">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onToggleSidebar} className="lg:hidden text-white hover:bg-white/10">
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-4">
            <img src="/logos/geco-logo.png" alt="GECO Asia" className="h-12 w-auto" />
            <div className="border-l border-white/20 pl-4 hidden sm:block">
              <h1 className="text-xl font-bold text-white">HR Business Partner Portal</h1>
              <p className="text-xs text-white/80">Southeast Asia Operations</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors">
                  <img src="/logos/geco-logo.png" alt="Jervey" className="w-10 h-10 rounded-full object-cover border-2 border-white/20"/>
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-white">Jervey</p>
                    <div className="flex items-center gap-1 text-xs text-white/80">
                      <Badge className={`orange text-white text-[10px] px-1.5 py-0`}>
                        Super Admin
                      </Badge>
                      <span>•</span>
                      <span>All</span>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-white/80 hidden md:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-2 border-b">
                  <p className="font-medium">Jervey</p>
                  <p className="text-xs text-muted-foreground">jervey.benitez@geco.asia</p>
                </div>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  My Profile
                </DropdownMenuItem>
                {"Super Admin" === "Super Admin" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      User Management
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>

      </div>
    </header>
  );
}