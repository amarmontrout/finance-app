"use client"

import { NAV_DATA } from "@/components/Layouts/sidebar/data"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { PropsWithChildren } from "react"

export default function AdminLayout({ children }: PropsWithChildren) {
  const pathname = usePathname()
  const sections = NAV_DATA[0].items

  const isRouteActive = (url: string) =>
    pathname === url || (url !== "/" && pathname.startsWith(`${url}/`))

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-b from-[#A97C2F] via-[#3E5942] to-[#102A1B]">
      {/* <Sidebar /> */}

      <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 2xl:p-10">
          {children}
        </main>

        <nav className="flex h-20 border-t border-white/10 bg-black/20 backdrop-blur-md md:hidden">
          {sections.map((section) => {
            const active = isRouteActive(section.url)

            return (
              <Link
                key={section.title}
                href={section.url}
                className="flex flex-1 items-center justify-center"
              >
                <div
                  className="flex flex-col items-center gap-1 text-sm"
                  style={{
                    color: active ? "#A97C2F" : "#F5F1E8",
                  }}
                >
                  <section.icon className="size-6" />
                  <span>{section.title}</span>
                </div>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
