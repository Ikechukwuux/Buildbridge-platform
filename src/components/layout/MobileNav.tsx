import * as React from "react"
import Link from "next/link"
import { X, LayoutDashboard, User, Settings, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated?: boolean;
}

export function MobileNav({ isOpen, onClose, isAuthenticated = false }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-surface p-6 animate-in slide-in-from-right-full duration-300">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-primary font-bold text-headline-small" onClick={onClose}>
          BuildBridge
        </Link>
        <button 
          onClick={onClose}
          className="p-2 text-on-surface hover:bg-surface-variant rounded-full"
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {isAuthenticated ? (
        /* Authenticated Mobile Menu */
        <nav className="mt-8 flex flex-col gap-6">
          <Link 
            href="/dashboard" 
            className="text-headline-small text-on-surface hover:text-primary transition-colors flex items-center gap-3"
            onClick={onClose}
          >
            <LayoutDashboard className="h-6 w-6" />
            Dashboard
          </Link>
          <Link 
            href="/browse" 
            className="text-headline-small text-on-surface hover:text-primary transition-colors"
            onClick={onClose}
          >
            Browse Needs
          </Link>
          <Link 
            href="/profile" 
            className="text-headline-small text-on-surface hover:text-primary transition-colors flex items-center gap-3"
            onClick={onClose}
          >
            <User className="h-6 w-6" />
            Profile
          </Link>
          <Link 
            href="/account" 
            className="text-headline-small text-on-surface hover:text-primary transition-colors flex items-center gap-3"
            onClick={onClose}
          >
            <Settings className="h-6 w-6" />
            Settings
          </Link>
        </nav>
      ) : (
        /* Public Mobile Menu */
        <nav className="mt-8 flex flex-col gap-6">
          <Link 
            href="/browse" 
            className="text-headline-small text-on-surface hover:text-primary transition-colors"
            onClick={onClose}
          >
            Browse Needs
          </Link>
          <Link 
            href="/how-it-works" 
            className="text-headline-small text-on-surface hover:text-primary transition-colors"
            onClick={onClose}
          >
            How It Works
          </Link>
          <Link 
            href="/impact" 
            className="text-headline-small text-on-surface hover:text-primary transition-colors"
            onClick={onClose}
          >
            Impact Wall
          </Link>
        </nav>
      )}

      {!isAuthenticated && (
        <div className="mt-auto flex flex-col gap-4 pb-6">
          <Link href="/login" className="w-full" onClick={onClose}>
            <Button variant="ghost" className="w-full justify-center text-on-surface">Log In</Button>
          </Link>
          <Link href="/signup" className="w-full" onClick={onClose}>
            <Button className="w-full justify-center bg-primary text-white">Get Started</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
