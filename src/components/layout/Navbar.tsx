"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, User, LogOut, ChevronDown, LayoutDashboard, Settings, Sparkles, PlusCircle, X, MessageCircle, Mail, AtSign, Phone } from "lucide-react"
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
    };
    fetchUser();

    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
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
      {/* Top Announcement Bar - Hidden when authenticated */}
      {!isAuthenticated && (
        <div className="w-full bg-primary text-on-primary py-2 px-4 text-center">
          <p className="text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center gap-2">
            <span className="opacity-80">📣</span>
            BuildBridge: The #1 Direct Impact Platform for Nigeria's Artisans
            <Link href="/browse" className="underline hover:opacity-80 transition-opacity ml-1">
              Back a Trade Today →
            </Link>
          </p>
        </div>
      )}

      <header
        className={`w-full transition-all duration-300 border-b border-transparent ${
          isScrolled 
            ? "bg-white/90 backdrop-blur-md shadow-sm border-white/20 py-3" 
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center group cursor-pointer">
            <div className="relative h-6 w-[150px]">
              <Image
                src="/buildbridge-logo-primary.svg"
                alt="BuildBridge"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav - Hidden on Dashboard/Profile/Account for Auth users */}
          {!isAuthenticated && !isDashboard && (
            <nav className="hidden md:flex items-center gap-10">
              {[
                { name: "Browse Needs", href: "/browse" },
                { name: "How It Works", href: "/how-it-works" },
                { name: "Impact Wall", href: "/impact" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-bold tracking-wide transition-all duration-300 hover:scale-105 cursor-pointer ${
                    isScrolled ? 'text-on-surface-variant hover:text-primary' : 'text-on-surface-variant hover:text-primary'
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
                  href="/signup" 
                  className={`hidden sm:flex h-11 px-7 rounded-full font-extrabold text-sm transition-all items-center justify-center hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/10 ${
                    isScrolled ? 'bg-primary text-white' : 'bg-primary text-white'
                  }`}
                >
                  Get Started
                </Link>
              </>
            )}

            {!isAuthenticated && !isDashboard && (
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

      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} isAuthenticated={isAuthenticated} />

      {/* Contact Support Overlay */}
      <ContactSupportOverlay 
        isOpen={showContactSupport} 
        onClose={() => setShowContactSupport(false)} 
      />
    </>
  );
}

function UserMenu({ 
  user, 
  displayName, 
  onSignOut, 
  isScrolled,
  onContactSupport
}: { 
  user: SupabaseUser | null, 
  displayName: string, 
  onSignOut: () => void,
  isScrolled: boolean,
  onContactSupport: () => void
}) {
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

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 active:scale-95 group",
          isScrolled ? "hover:bg-primary/5" : "hover:bg-white/10"
        )}
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20 shadow-inner">
          {displayName.charAt(0).toUpperCase()}
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
              href="/create-need"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-black group mb-2 shadow-lg shadow-primary/20"
            >
              <PlusCircle className="w-4 h-4" />
              Create Need
            </Link>

            <Link 
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 text-on-surface-variant hover:text-primary transition-colors text-sm font-bold group"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>

            <Link 
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 text-on-surface-variant hover:text-primary transition-colors text-sm font-bold group"
            >
              <User className="w-4 h-4" />
              Profile
            </Link>

            <Link 
              href="/account"
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

// Contact Support Overlay Component
function ContactSupportOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const supportChannels = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      description: "Chat with us instantly",
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      color: "bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20",
      borderColor: "border-[#25D366]/20 hover:border-[#25D366]/40",
      href: "https://wa.me/2348000000000?text=Hi%20BuildBridge%20Support",
    },
    {
      id: "email",
      label: "Email",
      description: "Send us a detailed message",
      icon: <Mail className="w-7 h-7" />,
      color: "bg-primary/10 text-primary hover:bg-primary/20",
      borderColor: "border-primary/20 hover:border-primary/40",
      href: "mailto:support@buildbridge.app",
    },
    {
      id: "twitter",
      label: "Twitter / X",
      description: "DM us on social media",
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: "bg-gray-900/10 text-gray-900 hover:bg-gray-900/20",
      borderColor: "border-gray-900/20 hover:border-gray-900/40",
      href: "https://twitter.com/BuildBridgeNG",
    },
    {
      id: "instagram",
      label: "Instagram",
      description: "Follow & message us",
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      color: "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20",
      borderColor: "border-pink-500/20 hover:border-pink-500/40",
      href: "https://instagram.com/BuildBridgeNG",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-on-surface/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 pb-4 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-black text-on-surface tracking-tight">Contact Support</h2>
                <p className="text-sm text-on-surface-variant font-medium mt-1">Choose your preferred channel</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-surface-variant/50 transition-colors text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Channel Options */}
            <div className="p-8 pt-4 flex flex-col gap-3">
              {supportChannels.map((channel) => (
                <a
                  key={channel.id}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group",
                    channel.borderColor
                  )}
                >
                  <div className={cn("p-3 rounded-2xl transition-colors", channel.color)}>
                    {channel.icon}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-black text-on-surface">{channel.label}</p>
                    <p className="text-xs text-on-surface-variant font-medium">{channel.description}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-on-surface-variant/30 -rotate-90 group-hover:translate-x-1 transition-transform" />
                </a>
              ))}
            </div>

            {/* Footer */}
            <div className="px-8 pb-8 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/30">
                We typically respond within 2 hours
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}