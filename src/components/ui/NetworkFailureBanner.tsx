"use client"

import * as React from "react"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "./Button"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface NetworkFailureBannerProps {
  className?: string
  showDemo?: boolean
}

export function NetworkFailureBanner({ className, showDemo = false }: NetworkFailureBannerProps) {
  const [isOffline, setIsOffline] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(false)
  
  // Listen to online/offline events
  React.useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
      setIsVisible(false)
    }
    
    const handleOffline = () => {
      setIsOffline(true)
      setIsVisible(true)
    }
    
    // Check initial status
    if (!navigator.onLine) {
      setIsOffline(true)
      setIsVisible(true)
    }
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
  
  // Demo mode for presentation (optional)
  React.useEffect(() => {
    if (showDemo) {
      const timer = setTimeout(() => {
        setIsOffline(true)
        setIsVisible(true)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [showDemo])
  
  const handleRetry = () => {
    // Retry logic: check if back online and hide if so
    if (navigator.onLine) {
      setIsOffline(false)
      setIsVisible(false)
    } else {
      // Could trigger a refetch of failed requests here
      // For now, just keep visible
    }
  }
  
  const handleClose = () => {
    setIsVisible(false)
  }
  
  // Auto-dismiss when back online
  React.useEffect(() => {
    if (navigator.onLine && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 3000) // Keep visible for 3 seconds after reconnection
      return () => clearTimeout(timer)
    }
  }, [isVisible, navigator.onLine])
  
  if (!isVisible) return null
  
  return (
    <div className={cn("fixed top-0 left-0 right-0 z-50 animate-in slide-in-from-top duration-300", className)}>
      <div className="bg-warning text-on-warning py-3 px-4 shadow-lg">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <p className="text-sm font-bold">
                You appear to be offline. Check your connection and try again.
              </p>
              <Link 
                href="/contact" 
                className="text-sm font-medium underline hover:opacity-80 transition-opacity"
              >
                Need help? Contact support →
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetry}
              className="text-on-warning hover:bg-warning/20 h-8 px-3 text-sm font-bold"
            >
              Retry
            </Button>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-warning/20 rounded-full transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}