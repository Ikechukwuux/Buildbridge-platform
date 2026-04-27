"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  Search,
  Mail,
  Bell,
  ChevronDown,
  User,
  Settings,
  MessageCircle,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
  userEmail?: string;
  avatarLetter: string;
}

export function DashboardHeader({ userName, userEmail, avatarLetter }: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = React.useMemo(() => createClient(), []);
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleContactSupport = () => {
    setIsOpen(false);
    window.location.href = "mailto:support@buildbridge.app";
  };

  return (
    <div className="flex items-center justify-between gap-6 mb-8">
      {/* ── Search Bar ── */}
      <div className="flex-1 max-w-2xl relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-on-surface-variant/40 group-focus-within:text-primary transition-colors">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          placeholder="Search your dashboard..."
          className="w-full h-14 bg-surface border-2 border-outline-variant/30 rounded-2xl pl-14 pr-6 text-sm font-bold placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/50 focus:bg-white transition-all shadow-sm group-hover:border-outline-variant/50"
        />
      </div>

      {/* ── Actions & Profile ── */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="hidden sm:flex items-center gap-2">
          <button className="h-12 w-12 flex items-center justify-center rounded-xl bg-surface border-2 border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all shadow-sm">
            <Mail className="h-5 w-5" />
          </button>
          <button className="h-12 w-12 flex items-center justify-center rounded-xl bg-surface border-2 border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all shadow-sm relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full border-2 border-surface" />
          </button>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-8 bg-outline-variant/30 mx-2" />

        {/* User Profile with Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 pl-2 py-1 pr-1 rounded-2xl hover:bg-surface-variant/10 transition-colors cursor-pointer group"
          >
            <div className="flex flex-col items-end hidden md:flex">
              <span className="text-sm font-black text-on-surface leading-none mb-1 group-hover:text-primary transition-colors">
                {userName}
              </span>
              <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest leading-none">
                Artisan
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-black text-sm shadow-inner group-hover:scale-105 transition-transform">
              {avatarLetter}
            </div>
            <ChevronDown className={cn(
              "h-4 w-4 text-on-surface-variant/40 group-hover:text-primary transition-all",
              isOpen && "rotate-180"
            )} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-56 rounded-[1.5rem] bg-white shadow-2xl border border-outline-variant overflow-hidden p-2 z-[60]"
              >
                <div className="px-4 py-3 border-b border-outline-variant mb-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">Logged in as</p>
                  <p className="text-sm font-bold text-on-surface truncate">{userEmail}</p>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-bold",
                    pathname === "/dashboard"
                      ? "bg-primary/10 text-primary"
                      : "text-on-surface-variant hover:text-primary hover:bg-primary/5"
                  )}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-bold",
                    pathname === "/profile"
                      ? "bg-primary/10 text-primary"
                      : "text-on-surface-variant hover:text-primary hover:bg-primary/5"
                  )}
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>

                <Link
                  href="/dashboard/account"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-bold",
                    pathname === "/dashboard/account"
                      ? "bg-primary/10 text-primary"
                      : "text-on-surface-variant hover:text-primary hover:bg-primary/5"
                  )}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>

                <button
                  onClick={handleContactSupport}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 text-on-surface-variant hover:text-primary transition-colors text-sm font-bold"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact Support
                </button>

                <div className="h-px bg-outline-variant my-1 px-2" />

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-error/5 text-on-surface-variant hover:text-error transition-colors text-sm font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
