// data/v2/getAuthenticatedSupabase.ts

import { supabaseBrowser } from "@/supabase/client"

export const getAuthenticatedSupabase = async () => {
  const sb = supabaseBrowser()

  const {
    data: { user },
  } = await sb.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  return {
    sb,
    user,
  }
}
