import { NextRequest, NextResponse } from "next/server"

export function proxy(request: NextRequest) {
  const isLoggedIn = true

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!login|_next|favicon.ico).*)'
  ]
}