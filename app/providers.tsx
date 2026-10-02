"use client"

import { ThemeProvider } from "@emotion/react"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter"
import { DataProvider } from "./contexts/data-context"
import { TransactionProvider } from "./contexts/transaction-context"
import { theme } from "./theme"

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppRouterCacheProvider>
      <TransactionProvider>
        <DataProvider>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </DataProvider>
      </TransactionProvider>
    </AppRouterCacheProvider>
  )
}

export default Providers
