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
  photoUrl?: string | null;
}

export function DashboardHeader({ userName, userEmail, avatarLetter, photoUrl }: DashboardHeaderProps) {
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

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 py-1 pr-1 rounded-2xl hover:bg-surface-variant/10 transition-colors cursor-pointer group">
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-sm font-black text-on-surface leading-none mb-1 group-hover:text-primary transition-colors">
              {userName}
            </span>
            <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest leading-none">
              Artisan
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-black text-sm shadow-inner group-hover:scale-105 transition-transform overflow-hidden">
            {photoUrl ? (
              <img src={photoUrl} alt={userName} className="w-full h-full object-cover" />
            ) : (
              avatarLetter
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-on-surface-variant/40 group-hover:text-primary transition-colors" />
        </div>
      </div>
    </div>
  );
}
