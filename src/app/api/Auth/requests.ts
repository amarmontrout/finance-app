import { supabaseBrowser } from "@/utils/supabase/client"
import { CredType } from "./models"
import { AuthError, Session, User, WeakPassword } from "@supabase/supabase-js"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

/**
 * Perform login
 */
export const doLogin = async ({
  credentials,
  callback,
  errorHandler
}: {
  credentials: CredType
  callback: (response: {user: User, session: Session, weakPassword?: WeakPassword}) => void
  errorHandler: (error: AuthError) => void
}) => {
  const supabase = supabaseBrowser()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.username,
    password: credentials.password,
  })

  if (error) {
    errorHandler(error)
  } else {
    callback(data)
  }
}

/**
 * Perform logout
 */
export const doLogout = async ({
  router,
  errorHandler
}: {
  router: AppRouterInstance
  errorHandler: (error: AuthError) => void
}) => {
  const supabase = supabaseBrowser()

  const { error } = await supabase.auth.signOut()

  if (error) {
    errorHandler(error)
  } else {
    router.replace("/login")
  }
}