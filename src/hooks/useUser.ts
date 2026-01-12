import { supabaseBrowser } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

export const useUser = () => {
  const supabase = supabaseBrowser()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user || null)
    }

    fetchUser()

    // Listen to auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return user
}
