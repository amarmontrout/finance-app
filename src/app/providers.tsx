"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { CategoryProvider } from "@/contexts/categories-context";
import { TransactionProvider } from "@/contexts/transaction-context";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <CategoryProvider>
        <TransactionProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </TransactionProvider>
      </CategoryProvider>
    </ThemeProvider>
  );
}
