"use client"

import { ThemeProvider as MUIThemeProvider } from "@mui/material";
import { ThemeProvider as NextThemeProvider, useTheme } from "next-themes";
import { lightTheme, darkTheme } from "@/globals/theme";
import { useState, useEffect } from "react";
import { TransactionProvider } from "@/contexts/transactions-context";

const MUIThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme(); // "light" | "dark"
  const theme = resolvedTheme === "dark" ? darkTheme : lightTheme;

  return <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="light"
    >
      <TransactionProvider>
        {mounted &&
          <MUIThemeWrapper>
            {children}
          </MUIThemeWrapper> 
        }
      </TransactionProvider>
    </NextThemeProvider>
  )
}

export default Providers