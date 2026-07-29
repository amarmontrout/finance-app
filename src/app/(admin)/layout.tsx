"use client"

import { NAV_DATA } from "@/components/Layouts/sidebar/data"
import { neutralColor } from "@/global/colors"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { PropsWithChildren } from "react"

export default function AdminLayout({ children }: PropsWithChildren) {
  const pathname = usePathname()

  const sections = NAV_DATA[0].items

  const isRouteActive = (url?: string) => {
    if (!url) return false
    if (url === "/") return pathname === "/"
    return pathname === url || pathname.startsWith(url + "/")
  }

  const isSectionActive = (section: any) =>
    section.items?.length
      ? section.items.some((item: any) => isRouteActive(item.url))
      : isRouteActive(section.url)

  const activeSection = sections.find(isSectionActive) ?? sections[0]

  const getFirstValidUrl = (section: any) =>
    section.items?.length ? section.items[0].url : (section.url ?? "/")

  return (
    <div
      className="
        flex
        h-screen
        overflow-hidden
        bg-gradient-to-b
        from-[#A97C2F]
        via-[#3E5942]
        to-[#102A1B]
      "
    >
      {/* <Sidebar /> */}

      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 2xl:p-10">
          {children}
        </main>

        {activeSection?.items?.length > 1 && pathname !== "/settings" && (
          <div className="flex h-10 border-t border-white/10 bg-white/10 backdrop-blur-md md:hidden">
            {activeSection.items.map((subpage: any) => {
              const active = isRouteActive(subpage.url)

              return (
                <Link
                  key={subpage.url}
                  href={subpage.url}
                  className="flex flex-1 items-center justify-center text-sm"
                  style={{
                    color: active ? neutralColor.color : "white",
                  }}
                >
                  {subpage.title}
                </Link>
              )
            })}
          </div>
        )}

        <div className="flex h-20 border-t border-white/10 bg-black/20 backdrop-blur-md md:hidden">
          {sections.map((section: any) => {
            const active = isSectionActive(section)

            return (
              <Link
                key={section.title}
                href={getFirstValidUrl(section)}
                className="flex flex-1 items-center justify-center"
              >
                <div
                  className="flex flex-col items-center gap-1 text-sm"
                  style={{
                    color: active ? "#C9A86A" : "rgba(255,255,255,0.7)",
                  }}
                >
                  <section.icon className="size-6" />
                  <span>{section.title}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
