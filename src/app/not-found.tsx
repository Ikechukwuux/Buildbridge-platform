import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Compass, ArrowRight, Search, Hammer } from "lucide-react"

export const metadata = {
  title: "Page not found · BuildBridge",
}

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-24">
      <div className="max-w-xl mx-auto text-center flex flex-col items-center gap-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-[2.5rem] bg-primary/10 flex items-center justify-center">
            <Compass className="h-16 w-16 text-primary" />
          </div>
          <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-on-surface text-surface text-xs font-black tracking-widest uppercase shadow-lg">
            404
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight">
            We can't find that page
          </h1>
          <p className="text-base md:text-lg font-medium text-on-surface-variant leading-relaxed max-w-md mx-auto">
            The link may be broken or the page may have moved. Try one of the routes below.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
          <Link href="/" className="flex-1">
            <Button className="w-full h-12 rounded-full font-black gap-2">
              Go to homepage
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/browse" className="flex-1">
            <Button variant="outline" className="w-full h-12 rounded-full font-black gap-2">
              <Search className="h-4 w-4" />
              Browse needs
            </Button>
          </Link>
        </div>

        <div className="pt-6 flex items-center gap-2 text-sm text-on-surface-variant font-medium">
          <Hammer className="h-4 w-4 text-primary" />
          Still lost?{" "}
          <Link href="/contact" className="font-black text-primary hover:underline">
            Get in touch
          </Link>
        </div>
      </div>
    </main>
  )
}