import { neutralColor } from "@/globals/colors"
import Header from "@/header/Header"
import { HorizontalNavbar, Navbar } from "@/navigation/Navbar"
import { Box } from "@mui/material"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import "../../globals.css"
import Providers from "../providers"

export const metadata: Metadata = {
  title: "My Finances",
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
              flexDirection: "row",
              height: "100svh",
              overflow: "hidden",
              bgcolor: "background.default",
            }}
          >
            {/* Sidebar */}
            <Box
              component="nav"
              className="hidden md:flex md:w-[220px] shrink-0"
              sx={{
                bgcolor: "background.paper",
                borderRight: 1,
                borderColor: "background.paper",
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
              }}
            >
              {/* Header */}
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

              {/* Mobile nav */}
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
