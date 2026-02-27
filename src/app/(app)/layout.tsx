import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import Providers from "../providers"
import { Box } from "@mui/material"
import Header from "@/header/Header"
import "../../globals.css"
import { HorizontalNavbar, Navbar } from "@/navigation/Navbar"

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
            {/* Nav / Sidebar */}
            <Box
              className="hidden md:flex md:min-w-[205px]"
              component="nav"
              sx={{
                bgcolor: "background.paper",
                borderRight: 2,
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
                minWidth: 0,
                minHeight: 0,
                flexDirection: "column",
                bgcolor: "background.default",
              }}
            >
              {/* Header */}
              <Box
                component="header"
                sx={{
                  height: "70px",
                  bgcolor: "primary.main",
                  borderBottomLeftRadius: "15px",
                  borderBottomRightRadius: "15px",
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
                  color: "text.primary",
                  overflow: "hidden",
                }}
              >
                {/* Inner scroller */}
                <Box
                  className="p-[1rem] pb-[100px] md:pb-[1rem] lg:p-[2.5rem]"
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    overflowY: "auto",
                  }}
                >
                  {children}
                </Box>
              </Box>

              {/* Mobile nav */}
              <Box
                className="flex flex-col md:hidden"
                component="nav"
                position="fixed"
                bottom={0}
                width="100%"
                height="85px"
                alignItems={"center"}
                sx={{
                  bgcolor: "background.paper",
                  borderTop: 1,
                  borderColor: "divider",
                  boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
                  zIndex: 1000,
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
