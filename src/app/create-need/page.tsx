import { Metadata } from "next"
import { Suspense } from "react"
import NeedCreationFlow from "@/components/need-creation/NeedCreationFlow"

export const metadata: Metadata = {
  title: "Create a Need | BuildBridge",
  description: "Start raising funds for your trade equipment or service.",
}

function NeedCreationFlowWrapper({ searchParams }: { searchParams: { mode?: string } }) {
  const mode = searchParams?.mode === "create" ? "create" : "onboarding"
  return <NeedCreationFlow mode={mode} />
}

export default async function CreateNeedPage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const params = await searchParams
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <NeedCreationFlowWrapper searchParams={params} />
    </Suspense>
  )
}