import * as React from "react"
import Link from "next/link"
import { Facebook, Twitter, Instagram } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#7C3AED] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 mt-12 relative overflow-hidden">
      {/* Decorative Ornaments */}
      <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400" />
      <div className="absolute top-12 right-12 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between gap-16 pb-16 border-b border-white/20">
          {/* Newsletter Section */}
          <div className="flex-1 max-w-lg">
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
              Stay Connected <br />
              with <span className="text-yellow-400 italic">Causes</span>
            </h2>
            <p className="text-white/80 text-lg font-medium mb-8">
              Join our weekly newsletter to get updates on funded artisans and new high-impact needs.
            </p>
            <div className="relative group max-w-md">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full h-14 bg-white/10 border border-white/20 rounded-full px-8 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              />
              <button className="absolute right-2 top-2 h-10 px-6 rounded-full bg-yellow-400 text-black font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                Sign Up
              </button>
            </div>
          </div>

          {/* Sidebar Links */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-5">
              <h3 className="font-black text-sm uppercase tracking-widest text-yellow-400">Platform</h3>
              <Link href="/browse" className="text-sm font-bold opacity-80 hover:opacity-100 transition-opacity">Browse Needs</Link>
              <Link href="/impact" className="text-sm font-bold opacity-80 hover:opacity-100 transition-opacity">Impact Stories</Link>
              <Link href="/how-it-works" className="text-sm font-bold opacity-80 hover:opacity-100 transition-opacity">How It Works</Link>
              <Link href="/login" className="text-sm font-bold opacity-80 hover:opacity-100 transition-opacity">Log In</Link>
            </div>
            <div className="flex flex-col gap-5">
              <h3 className="font-black text-sm uppercase tracking-widest text-yellow-400">Explore</h3>
              <Link href="/artisans" className="text-sm font-bold opacity-80 hover:opacity-100 transition-opacity">Artisan Network</Link>
              <Link href="/partners" className="text-sm font-bold opacity-80 hover:opacity-100 transition-opacity">Collaborate</Link>
              <Link href="/blog" className="text-sm font-bold opacity-80 hover:opacity-100 transition-opacity">Success Blog</Link>
              <Link href="/careers" className="text-sm font-bold opacity-80 hover:opacity-100 transition-opacity">Careers</Link>
            </div>
            <div className="flex flex-col gap-5">
              <h3 className="font-black text-sm uppercase tracking-widest text-yellow-400">Support</h3>
              <Link href="/faq" className="text-sm font-bold opacity-80 hover:opacity-100 transition-opacity">Help Center</Link>
              <Link href="/privacy" className="text-sm font-bold opacity-80 hover:opacity-100 transition-opacity">Privacy</Link>
              <Link href="/terms" className="text-sm font-bold opacity-80 hover:opacity-100 transition-opacity">Terms</Link>
              <Link href="/contact" className="text-sm font-bold opacity-80 hover:opacity-100 transition-opacity">Contact Us</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-3">
             <Link href="/" className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary">
                  <span className="text-lg">B</span>
                </div>
                BuildBridge
             </Link>
             <p className="text-xs font-bold text-white/50 uppercase tracking-widest">
               Handcrafted in Lagos for the Future of Africa
             </p>
          </div>

          <div className="flex items-center gap-6">
            <Link href="https://twitter.com" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="https://facebook.com" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="https://instagram.com" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all">
              <Instagram className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center md:text-left">
           <p className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">
             &copy; {currentYear} BuildBridge Impact Platform. All Rights Reserved.
           </p>
        </div>
      </div>
    </footer>
  );
}