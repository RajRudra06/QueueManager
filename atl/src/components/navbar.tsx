"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui";
import { LogOut, LayoutDashboard, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) return null;

  const isAdmin = (session.user as any).role === "ADMIN";

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl glass px-6 py-3 rounded-full flex items-center justify-between z-50">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 group-hover:scale-110 transition-transform">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <span className="font-bold text-white tracking-tight hidden sm:inline-block">SmartQueue</span>
        </Link>
        
        <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
        
        <div className="flex items-center gap-1">
          <NavLink 
            href="/dashboard" 
            active={pathname === "/dashboard"}
            icon={<LayoutDashboard className="w-4 h-4" />}
          >
            Dashboard
          </NavLink>
          {isAdmin && (
            <NavLink 
              href="/admin" 
              active={pathname === "/admin"}
              icon={<ShieldCheck className="w-4 h-4" />}
            >
              Admin
            </NavLink>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex flex-col items-end mr-2">
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">Logged In As</span>
          <span className="text-xs font-semibold text-white/80">{session.user?.name}</span>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => signOut()} 
          className="p-2 h-fit rounded-full hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </nav>
  );
}

function NavLink({ href, active, icon, children }: { href: string, active: boolean, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
        active 
          ? "bg-white/10 text-white" 
          : "text-white/40 hover:text-white/80 hover:bg-white/5"
      )}
    >
      {icon}
      <span className="hidden md:inline-block">{children}</span>
    </Link>
  );
}
