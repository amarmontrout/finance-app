import type { Metadata } from "next"
import { Box } from "@mui/material"
import Header from "@/header/Header"
import "../../globals.css"
import Providers from "../providers"

export const metadata: Metadata = {
  title: "Finance Tracker",
  description: "Personal project to track finances.",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        style={{
          height: "100dvh",
          width: "100dvw",
          overflow: "hidden",
          margin: 0,
          padding: 0,
        }}
      >
        <Providers>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              minWidth: 0,
              minHeight: 0,
              height: "100%",
            }}
          >
            {/* Main column */}
            <Box
              sx={{
                display: "flex",
                flex: 1,
                minWidth: 0,
                minHeight: 0,
                flexDirection: "column",
              }}
            >
              {/* Header */}
              <Box
                component="header"
                sx={{
                  height: "70px",
                  bgcolor: "primary.main",
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Header />
              </Box>
              {/* Main content */}
              <Box
                component="main"
                sx={{
                  display: "flex",
                  flex: 1,
                  bgcolor: "background.default",
                  color: "text.primary",
                  overflow: "hidden",
                }}
              >
                {/* Inner scroller */}
                <Box
                  className="p-[1rem] lg:p-[2.5rem]"
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    overflowY: "auto",
                  }}
                >
                  {children}
                </Box>
              </Box>
            </Box>
          </Box>
        </Providers>
      </body>
    </html>
  )
}
