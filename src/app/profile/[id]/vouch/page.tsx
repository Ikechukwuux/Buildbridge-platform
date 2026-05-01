import { Metadata } from "next"
import { VouchForm } from "@/components/vouching/VouchForm"

export const metadata: Metadata = {
  title: "Vouch for a Tradesperson | BuildBridge",
  description: "Vouch for a skilled worker on BuildBridge.",
}

export default async function VouchPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ name?: string }>
}) {
  const { id } = await params
  const { name } = await searchParams

  const recipientProfileId = id
  const recipientName = name
    ? decodeURIComponent(name)
    : "This Tradesperson"

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <VouchForm recipientProfileId={recipientProfileId} recipientName={recipientName} />
    </main>
  )
}
