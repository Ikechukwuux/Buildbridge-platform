import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Wrench } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-md mx-auto text-center flex flex-col items-center gap-8">
        {/* Illustration */}
        <div className="relative">
          <div className="w-48 h-48 bg-surface-variant/30 rounded-full flex items-center justify-center">
            <Wrench className="h-24 w-24 text-primary/50" />
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-warning/40 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-warning rounded-full" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-display-small font-black text-on-surface">
            This page doesn't exist
          </h1>
          <p className="text-body-large text-on-surface-variant">
            It may have been removed or the link might be wrong.
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link href="/" className="flex-1">
            <Button className="w-full h-12">
              Go to Homepage
            </Button>
          </Link>
          <Link href="/browse" className="flex-1">
            <Button variant="secondary" className="w-full h-12">
              Browse open needs
            </Button>
          </Link>
        </div>
        
        {/* Additional help */}
        <p className="text-body-small text-on-surface-variant pt-8">
          Need help?{" "}
          <a 
            href="https://wa.me/2341234567890" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-bold text-primary hover:underline"
          >
            Chat with us on WhatsApp
          </a>
        </p>
      </div>
    </div>
  )
}