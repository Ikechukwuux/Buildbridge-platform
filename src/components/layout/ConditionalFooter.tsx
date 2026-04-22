"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  
  // Define paths where the footer should be hidden
  const hideFooterPaths = ["/dashboard", "/profile", "/onboarding"];
  
  const shouldHide = hideFooterPaths.some(path => 
    pathname === path || pathname?.startsWith(`${path}/`)
  );

  if (shouldHide) return null;

  return <Footer />;
}
