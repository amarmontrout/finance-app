"use client"

import { Logo } from "@/components/Logo"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { NAV_DATA } from "./data"
import { MenuItem } from "./menu-item"

export function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      <aside
        className="hidden w-[290px] border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-dark min-[850px]:block"
        aria-label="Main navigation"
      >
        <div className="flex h-full flex-col py-10 pl-[25px] pr-[7px]">
          <div className="relative pr-4.5">
            <Link href={"/"} className="px-0 py-2.5 min-[850px]:py-0">
              <Logo />
            </Link>
          </div>

          {/* Navigation */}
          <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto pr-3 min-[850px]:mt-10">
            {NAV_DATA.map((section) => (
              <div key={section.label} className="mb-6">
                <h2 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                  {section.label}
                </h2>

                <nav role="navigation" aria-label={section.label}>
                  <ul className="space-y-2">
                    {section.items.map((item) => {
                      const href = String(item.url)

                      return (
                        <li key={item.title}>
                          <MenuItem
                            className="flex items-center gap-3 py-3"
                            as="link"
                            href={href}
                            isActive={pathname === href}
                          >
                            <item.icon
                              className="size-6 shrink-0"
                              aria-hidden="true"
                            />
                            <span>{item.title}</span>
                          </MenuItem>
                        </li>
                      )
                    })}
                  </ul>
                </nav>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
