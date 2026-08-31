"use client"

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context"
import { CategoryProvider } from "@/contexts/categories-context"
import { DataProvider } from "@/contexts/data-context"
import { ThemeProvider } from "next-themes"
import { TransactionProvider } from "./(admin)/v2/TransactionsContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <CategoryProvider>
        <DataProvider>
          <TransactionProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </TransactionProvider>
        </DataProvider>
      </CategoryProvider>
    </ThemeProvider>
  )
}
