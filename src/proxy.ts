import { NextRequest, NextResponse } from "next/server"
import { updateSession } from "./utils/supabase/proxy"

export async function proxy(request: NextRequest) {
  // const isLoggedIn = true

  // if (!isLoggedIn) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }
  // return NextResponse.next()
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}