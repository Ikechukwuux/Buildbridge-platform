import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

/**
 * Dashboard layout — wraps all /dashboard/* routes.
 *
 * Provides:
 *  - A fixed left sidebar (DashboardSidebar) on desktop
 *  - A mobile top bar + drawer (also inside DashboardSidebar)
 *  - A scrollable main content area pushed 260px right on desktop,
 *    and 64px down (mobile top bar height) on mobile
 *
 * The global <Navbar> is suppressed on these routes via ConditionalNavbar
 * in the root layout, so there is no double header.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Left sidebar (desktop) + mobile top bar & drawer ── */}
      <DashboardSidebar />

      {/* ── Main scrollable content area ── */}
      {/*
        md:ml-[260px] — offset for fixed sidebar on desktop
        pt-16 md:pt-0 — offset for mobile top bar (64px); desktop has no top bar
      */}
      <div className="flex-1 md:ml-[260px] pt-16 md:pt-0 min-h-screen flex flex-col">
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
