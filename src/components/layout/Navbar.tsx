"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Logo } from "../ui/Logo"
import { Menu, User, LogOut, ChevronDown, LayoutDashboard, Settings, MessageCircle } from "lucide-react"
import { MobileNav } from "./MobileNav"
import { createClient } from "@/lib/supabase/client"
import { useRouter, usePathname } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard") || pathname?.startsWith("/profile") || pathname?.startsWith("/account");
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [user, setUser] = React.useState<SupabaseUser | null>(null);
  const [photoUrl, setPhotoUrl] = React.useState<string | null>(null);
  const [showContactSupport, setShowContactSupport] = React.useState(false);
  const supabase = React.useMemo(() => createClient(), []);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    const fetchUser = async () => {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Fetch profile photo
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("photo_url")
          .eq("user_id", user.id)
          .maybeSingle();
        setPhotoUrl(profile?.photo_url || null);
      }
    };
    fetchUser();

    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("photo_url")
          .eq("user_id", session.user.id)
          .maybeSingle();
        setPhotoUrl(profile?.photo_url || null);
      } else {
        setPhotoUrl(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  const isAuthenticated = user !== null && !pathname?.startsWith("/signup") && !pathname?.startsWith("/register");
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Top Announcement Bar */}
        <div className="w-full bg-primary text-on-primary py-2 px-4 text-center">
          <p className="text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center gap-2">
            <span className="opacity-80">📣</span>
            BuildBridge: The #1 Direct Impact Platform for Nigeria's Artisans
            <Link href="/browse" className="underline hover:opacity-80 transition-opacity ml-1">
              Back a Trade Today →
            </Link>
          </p>
        </div>

        <header
          className={`w-full transition-all duration-300 border-b border-transparent ${isScrolled
              ? "bg-white/90 backdrop-blur-md shadow-sm border-white/20 py-3"
              : "bg-transparent py-5"
            }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">

            {/* Logo */}
            <Logo variant="primary" />

            {/* Centered Desktop Nav - Hidden on Dashboard */}
            {!isDashboard && (
              <nav className="hidden md:flex items-center gap-10">
                {[
                  { name: "Browse Needs", href: "/browse" },
                  { name: "How It Works", href: "/how-it-works" },
                  { name: "Impact Wall", href: "/impact" },
                ].map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-bold tracking-wide transition-all duration-300 hover:scale-105 cursor-pointer ${isScrolled ? 'text-on-surface-variant hover:text-primary' : 'text-on-surface-variant hover:text-primary'
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            )}

            {/* Right Action Area */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <UserMenu
                  user={user}
                  displayName={displayName}
                  photoUrl={photoUrl}
                  onSignOut={handleSignOut}
                  isScrolled={isScrolled}
                  onContactSupport={() => setShowContactSupport(true)}
                />
              ) : (
                <>
                  <Link href="/login" className={`hidden sm:flex group cursor-pointer text-sm font-bold tracking-wide transition-all duration-300 hover:scale-105 ${isScrolled ? 'text-on-surface-variant hover:text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
                    Log In
                  </Link>

                  <Link
                    href={isAuthenticated ? "/dashboard/create-need" : "/signup"}
                    className={`hidden sm:flex h-11 px-7 rounded-full font-extrabold text-sm transition-all items-center justify-center hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/10 ${isScrolled ? 'bg-primary text-white' : 'bg-primary text-white'
                      }`}
                  >
                    Get Started
                  </Link>
                </>
              )}

              {!isDashboard && (
                <button
                  className={`md:hidden p-2 transition-colors cursor-pointer ${isScrolled ? 'text-on-surface-variant' : 'text-on-surface'}`}
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>
        </header>
      </div>

      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}

function UserMenu({
  user,
  displayName,
  photoUrl,
  onSignOut,
  isScrolled,
  onContactSupport
}: {
  user: SupabaseUser | null,
  displayName: string,
  photoUrl?: string | null,
  onSignOut: () => void,
  isScrolled: boolean,
  onContactSupport: () => void
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 active:scale-95 group",
          isScrolled ? "hover:bg-primary/5" : "hover:bg-white/10"
        )}
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20 shadow-inner overflow-hidden">
          {photoUrl ? (
            <img src={photoUrl} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            displayName.charAt(0).toUpperCase()
          )}
        </div>
        <span className={cn(
          "hidden sm:block text-sm font-black tracking-tight",
          isScrolled ? "text-on-surface" : "text-on-surface"
        )}>
          {displayName}
        </span>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform duration-300",
          isOpen ? "rotate-180" : "rotate-0",
          isScrolled ? "text-on-surface-variant" : "text-on-surface-variant"
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
              <p className="text-sm font-bold text-on-surface truncate">{user?.email}</p>
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
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 text-on-surface-variant hover:text-primary transition-colors text-sm font-bold group"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>

            <button
              onClick={() => {
                setIsOpen(false);
                onContactSupport();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 text-on-surface-variant hover:text-primary transition-colors text-sm font-bold group"
            >
              <MessageCircle className="w-4 h-4" />
              Contact Support
            </button>

            <div className="h-px bg-outline-variant my-1 px-2" />

            <button
              onClick={() => {
                setIsOpen(false);
                onSignOut();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-error/5 text-on-surface-variant hover:text-error transition-colors text-sm font-bold group"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}