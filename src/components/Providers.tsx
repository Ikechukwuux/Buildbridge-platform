"use client";

import { DemoAuthProvider } from "@/contexts/DemoAuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <DemoAuthProvider>{children}</DemoAuthProvider>;
}
