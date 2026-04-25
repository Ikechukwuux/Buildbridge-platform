"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { EditNeedForm } from "@/components/dashboard/EditNeedForm"
import { Loader2, ArrowLeft } from "lucide-react"

export default function EditNeedPage() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()
  
  const [need, setNeed] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNeed() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      const { data, error } = await supabase
        .from('needs')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error || !data) {
        console.error("Error fetching need:", error)
        router.push("/dashboard")
        return
      }

      setNeed(data)
      setLoading(false)
    }

    fetchNeed()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-8 flex flex-col gap-8">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors w-fit"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold">Back</span>
        </button>
        
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black text-on-surface tracking-tight">
            Edit Funding Need
          </h1>
          <p className="text-on-surface-variant">Update the details of your funding request below.</p>
        </div>

        <div className="bg-surface border border-outline-variant rounded-3xl p-6 md:p-8 shadow-sm">
          <EditNeedForm need={need} />
        </div>
      </main>
    </div>
  )
}
