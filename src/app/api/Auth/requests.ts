import { supabaseBrowser } from "@/utils/supabase/client"
import { 
  AppRouterInstance 
} from "next/dist/shared/lib/app-router-context.shared-runtime"
import { CredType } from "./models"
import { AuthError } from "@supabase/supabase-js"

/**
 * Perform login
 */
export const doLogin = async ({
  credentials,
  router,
  errorHandler
}: {
  credentials: CredType
  router: AppRouterInstance
  errorHandler: (error: AuthError) => void
}) => {
  const supabase = supabaseBrowser()

  const { error } = await supabase.auth.signInWithPassword({
    email: credentials.username,
    password: credentials.password,
  })

  if (error) {errorHandler(error)}

  await supabase.auth.getSession()
  router.push("/")
  router.refresh()
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
    if (error) {errorHandler(error)}
  }

  router.replace("/login")
}