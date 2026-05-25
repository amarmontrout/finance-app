"use client"

import { Header } from "@/components/Layouts/header"
import { Sidebar } from "@/components/Layouts/sidebar"
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

  const isSectionActive = (section: any) => {
    if (section.items?.length) {
      return section.items.some((item: any) => isRouteActive(item.url))
    }
    return isRouteActive(section.url)
  }

  const activeSection = sections.find(isSectionActive) ?? sections[0]

  const getFirstValidUrl = (section: any) => {
    if (section.items?.length) return section.items[0].url
    return section.url ?? "/"
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col bg-gray-2 dark:bg-[#020d1a]">
        <Header />

        <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6 2xl:p-10">
          <div className="mx-auto w-full max-w-screen-2xl">{children}</div>
        </main>

        {/* MOBILE SUB NAV (only for sections with children) */}
        {activeSection?.items?.length > 1 && pathname !== "/settings" && (
          <div className="flex h-[40px] items-center bg-white px-4 border-b border-stroke dark:border-stroke-dark dark:bg-gray-dark md:hidden">
            {activeSection.items.map((subpage: any) => {
              const active = isRouteActive(subpage.url)

              return (
                <Link
                  key={subpage.url}
                  href={subpage.url}
                  className="text-sm"
                  style={{
                    color: active ? neutralColor.color : undefined,
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  {subpage.title}
                </Link>
              )
            })}
          </div>
        )}

        {/* MOBILE BOTTOM NAV */}
        <div className="sticky bottom-0 z-30 flex h-[80px] bg-white px-4 py-2 dark:bg-gray-dark md:hidden">
          {sections.map((section: any) => {
            const active = isSectionActive(section)

            return (
              <Link
                key={section.title}
                href={getFirstValidUrl(section)}
                style={{
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <div
                  className="flex flex-col items-center justify-center"
                  style={{
                    color: active ? neutralColor.color : undefined,
                  }}
                >
                  <section.icon className="size-6 shrink-0" />

                  <span className="text-sm">{section.title}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
