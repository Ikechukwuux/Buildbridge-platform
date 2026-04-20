import Link from "next/link"
import { Button } from "./Button"
import { Wrench, Clock } from "lucide-react"

interface MaintenanceModeProps {
  estimatedReturnTime?: string
}

export function MaintenanceMode({ estimatedReturnTime }: MaintenanceModeProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-lg mx-auto text-center flex flex-col items-center gap-10">
        {/* Illustration */}
        <div className="relative">
          <div className="w-56 h-56 bg-surface-variant/30 rounded-full flex items-center justify-center">
            <div className="w-44 h-44 bg-surface-variant/50 rounded-full flex items-center justify-center">
              <Wrench className="h-32 w-32 text-primary/40" />
            </div>
          </div>
          <div className="absolute -top-4 -right-4 bg-primary/10 p-4 rounded-full">
            <Clock className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-6">
          <h1 className="text-display-medium font-black text-on-surface">
            BuildBridge is taking a short break
          </h1>
          <p className="text-body-large text-on-surface-variant">
            We're making improvements. We'll be back shortly.
          </p>
          
          {estimatedReturnTime && (
            <div className="inline-flex items-center gap-3 bg-surface-variant/30 px-6 py-4 rounded-2xl">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-body-large font-bold text-on-surface">
                Expected back by {estimatedReturnTime}
              </span>
            </div>
          )}
        </div>
        
        {/* Support */}
        <div className="pt-8 border-t border-outline-variant/30 w-full">
          <p className="text-body-large text-on-surface-variant mb-6">
            Need immediate assistance?
          </p>
          <a 
            href="https://wa.me/2341234567890" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full text-body-large font-bold hover:opacity-90 transition-opacity shadow-lg"
          >
            <span>💬</span>
            Chat with us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}