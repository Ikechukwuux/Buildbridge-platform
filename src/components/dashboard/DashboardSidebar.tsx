"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/ui/Logo";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Nav items
───────────────────────────────────────────── */
const NAV_ITEMS = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Active Needs",
    href: "/dashboard/needs",
    icon: ListChecks,
    exact: false,
  },
  {
    label: "Create Need",
    href: "/dashboard/create-need",
    icon: PlusCircle,
    exact: false,
  },
  {
    label: "Trust & Badges",
    href: "/dashboard#trust",
    icon: ShieldCheck,
    exact: false,
  },
] as const;

const EXTERNAL_NAV_ITEMS = [
  {
    label: "Impact Wall",
    href: "/impact",
    icon: Sparkles,
  },
  {
    label: "Browse Needs",
    href: "/browse",
    icon: Search,
  },
] as const;

/* ─────────────────────────────────────────────
   Sidebar inner content (shared between desktop + mobile drawer)
───────────────────────────────────────────── */
function SidebarContent({
  onClose,
  pathname,
  displayName,
  userEmail,
  onSignOut,
}: {
  onClose?: () => void;
  pathname: string;
  displayName: string;
  userEmail: string;
  onSignOut: () => void;
}) {
  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Logo ── */}
      <div className="px-6 pt-8 pb-6 flex items-center justify-between">
        <Logo variant="white" onClick={onClose} />
        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ── Primary nav ── */}
      <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40 px-3 mb-2">
          Dashboard
        </p>

        {NAV_ITEMS.map(({ label, href, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "group flex items-center gap-3 px-3 py-3 rounded-[14px] text-sm font-bold transition-all duration-200 relative",
                active
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/70 hover:text-white hover:bg-white/8"
              )}
            >
              {/* Active left accent bar */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-white rounded-r-full" />
              )}
              <Icon
                className={cn(
                  "w-[18px] h-[18px] shrink-0 transition-colors",
                  active ? "text-white" : "text-white/50 group-hover:text-white/80"
                )}
              />
              <span className="flex-1">{label}</span>
              {active && (
                <ChevronRight className="w-3.5 h-3.5 text-white/40" />
              )}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-4 h-px bg-white/10 mx-3" />

        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40 px-3 mb-2">
          Explore
        </p>

        {EXTERNAL_NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className="group flex items-center gap-3 px-3 py-3 rounded-[14px] text-sm font-bold text-white/70 hover:text-white hover:bg-white/8 transition-all duration-200"
          >
            <Icon className="w-[18px] h-[18px] shrink-0 text-white/50 group-hover:text-white/80 transition-colors" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* ── User block ── */}
      <div className="px-4 pb-6 pt-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-3 rounded-[14px] bg-white/8 hover:bg-white/12 transition-colors">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-inner">
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate leading-none mb-0.5">
              {displayName}
            </p>
            <p className="text-[11px] text-white/50 truncate">{userEmail}</p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Link
              href="/dashboard/account"
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Account settings"
            >
              <Settings className="w-4 h-4" />
            </Link>
            <button
              onClick={onSignOut}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main export
───────────────────────────────────────────── */
export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [displayName, setDisplayName] = React.useState("Artisan");
  const [userEmail, setUserEmail] = React.useState("");

  React.useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setDisplayName(
          user.user_metadata?.full_name || user.email?.split("@")[0] || "Artisan"
        );
        setUserEmail(user.email || "");
      }
    };
    fetchUser();
  }, [supabase]);

  // Close mobile drawer on route change
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const sidebarProps = { pathname, displayName, userEmail, onSignOut: handleSignOut };

  return (
    <>
      {/* ════════════════════════════════════════
          Desktop sidebar — fixed, 260px wide
      ════════════════════════════════════════ */}
      <aside
        className="hidden md:flex flex-col fixed inset-y-0 left-0 w-[260px] z-40"
        style={{
          background:
            "linear-gradient(160deg, #65558f 0%, #4f378b 55%, #3b2878 100%)",
        }}
      >
        {/* Subtle decorative radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.06) 0%, transparent 60%)",
          }}
        />
        <div className="relative z-10 flex flex-col h-full">
          <SidebarContent {...sidebarProps} />
        </div>
      </aside>

      {/* ════════════════════════════════════════
          Mobile top bar + drawer
      ════════════════════════════════════════ */}

      {/* Thin mobile top bar */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-4"
        style={{
          background: "linear-gradient(90deg, #65558f 0%, #4f378b 100%)",
        }}
      >
        <button
          onClick={() => setMobileOpen(true)}
          className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Logo variant="white" />

        {/* Avatar shortcut */}
        <Link href="/dashboard/account" aria-label="Account">
          <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white font-black text-xs">
            {displayName.charAt(0).toUpperCase()}
          </div>
        </Link>
      </header>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="md:hidden fixed inset-y-0 left-0 z-50 w-72"
              style={{
                background:
                  "linear-gradient(160deg, #65558f 0%, #4f378b 55%, #3b2878 100%)",
              }}
            >
              <SidebarContent
                {...sidebarProps}
                onClose={() => setMobileOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
