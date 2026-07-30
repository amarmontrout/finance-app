import { supabaseBrowser } from "@/supabase/client"
import { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

export const useUser = () => {
  const supabase = supabaseBrowser()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setUser(data.session?.user ?? null)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return user
}
