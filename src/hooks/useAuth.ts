import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { type User } from "@supabase/supabase-js"

/**
 * Auth hook using real Supabase authentication.
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)
    }

    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setIsLoading(false)
  }

  return { 
    signOut, 
    user, 
    isLoading,
    isAuthenticated: user !== null 
  }
}
