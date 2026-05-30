import {
  fetchPendingNeeds,
  fetchPendingVerifications,
  fetchPendingProofs,
  fetchPlatformStats,
} from "./actions"
import { fetchPendingDeletionRequests } from "@/app/actions/account-deletion"
import { AdminNeedList } from "./AdminNeedList"
import { AdminVerificationList } from "./AdminVerificationList"
import { AdminProofList } from "./AdminProofList"
import { AdminDeletionList } from "./AdminDeletionList"
import { AdminStats } from "./AdminStats"
import { ShieldCheck, UserCheck, Camera, BarChart3, Trash2 } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  let needs: any[] = []
  let verifications: any[] = []
  let proofs: any[] = []
  let deletions: any[] = []
  let stats: Awaited<ReturnType<typeof fetchPlatformStats>> | null = null
  let error: string | null = null

  try {
    [needs, verifications, proofs, deletions, stats] = await Promise.all([
      fetchPendingNeeds(),
      fetchPendingVerifications(),
      fetchPendingProofs(),
      fetchPendingDeletionRequests(),
      fetchPlatformStats(),
    ])
  } catch (err: any) {
    error = err.message
  }

  return (
    <main className="min-h-screen bg-surface pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        {/* ── Platform Stats ── */}
        <section>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-black text-on-surface tracking-tight">
              Platform Overview
            </h1>
          </div>
          <p className="text-on-surface-variant mb-6">
            Live snapshot of artisans, needs, pledges, and pending review queues.
          </p>

          {error ? (
            <div className="p-6 rounded-2xl bg-red-50 border border-red-200">
              <p className="text-sm font-bold text-red-600">Failed to load: {error}</p>
            </div>
          ) : stats ? (
            <AdminStats stats={stats} pendingProofs={proofs.length} />
          ) : null}
        </section>

        {/* ── Needs Section ── */}
        <section>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-amber-600" />
            </div>
            <h2 className="text-3xl font-black text-on-surface tracking-tight">
              Needs Review
            </h2>
          </div>
          <p className="text-on-surface-variant mb-6">
            Approve or reject pending funding requests. Approved needs become publicly visible.
          </p>

          {!error && <AdminNeedList needs={needs} />}
        </section>

        {/* ── Proof Submissions Section ── */}
        <section>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-2xl bg-rose-500/10 flex items-center justify-center">
              <Camera className="h-5 w-5 text-rose-500" />
            </div>
            <h2 className="text-3xl font-black text-on-surface tracking-tight">
              Proof Review
            </h2>
          </div>
          <p className="text-on-surface-variant mb-6">
            Review proof submissions from funded artisans. Approving completes the need; rejecting asks the artisan to resubmit.
          </p>

          {!error && <AdminProofList proofs={proofs} />}
        </section>

        {/* ── Verifications Section ── */}
        <section>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-2xl bg-green-500/10 flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-3xl font-black text-on-surface tracking-tight">
              Identity Verification
            </h2>
          </div>
          <p className="text-on-surface-variant mb-6">
            Approve or reject pending NIN/BVN identity verifications. Approved identities will appear as verified on artisan profiles.
          </p>

          {!error && <AdminVerificationList verifications={verifications} />}
        </section>

        {/* ── Data Deletion Requests Section ── */}
        <section>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-2xl bg-error/10 flex items-center justify-center">
              <Trash2 className="h-5 w-5 text-error" />
            </div>
            <h2 className="text-3xl font-black text-on-surface tracking-tight">
              Data Deletion Requests
            </h2>
          </div>
          <p className="text-on-surface-variant mb-6">
            NDPA 2023: process within 30 days. Mark a request as complete once the user's personal data has been removed or anonymised across all tables.
          </p>

          {!error && <AdminDeletionList requests={deletions} />}
        </section>
      </div>
    </main>
  )
}
