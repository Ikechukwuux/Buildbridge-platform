"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Scroll to the very top smoothly on every route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" // Use 'instant' rather than 'smooth' so it doesn't visibly scroll past content during transitions
    })
  }, [pathname])

  return null
}
