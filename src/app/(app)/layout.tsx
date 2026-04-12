import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import Providers from "../providers"
import { Box } from "@mui/material"
import Header from "@/header/Header"
import "../../globals.css"
import { HorizontalNavbar, Navbar } from "@/navigation/Navbar"
import { neutralColor } from "@/globals/colors"

export const metadata: Metadata = {
  title: "Finance Tracker",
  description: "Personal project to track finances.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <Box
            sx={{
              display: "flex",
              height: "100dvh",
              overflow: "hidden",
            }}
          >
            {/* Sidebar */}
            <Box
              component="nav"
              className="hidden md:flex md:w-[220px] shrink-0"
              sx={{
                bgcolor: "background.paper",
                borderRight: 1,
                borderColor: "divider",
              }}
            >
              <Navbar />
            </Box>

            {/* Main column */}
            <Box
              sx={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                minWidth: 0,
                bgcolor: "background.default",
              }}
            >
              {/* Header (sticky instead of fixed layout hacks) */}
              <Box
                component="header"
                sx={{
                  position: "sticky",
                  top: 0,
                  height: { xs: 51, sm: 70 },
                  bgcolor: neutralColor.bg,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  zIndex: 10,
                }}
              >
                <Header />
              </Box>

              {/* Scroll container */}
              <Box
                component="main"
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  px: { xs: 2, lg: 5 },
                  py: { xs: 2, lg: 4 },
                }}
              >
                {children}
              </Box>

              {/* Mobile nav (sticky bottom instead of layout split) */}
              <Box
                component="nav"
                className="md:hidden"
                sx={{
                  position: "sticky",
                  bottom: 0,
                  height: 80,
                  bgcolor: neutralColor.bg,
                  boxShadow: "0 -2px 8px rgba(0,0,0,0.15)",
                  zIndex: 10,
                }}
              >
                <HorizontalNavbar />
              </Box>
            </Box>
          </Box>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
