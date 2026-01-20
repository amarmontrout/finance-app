import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import Providers from "../providers";
import { Box } from "@mui/material";
import Header from "@/header/Header";
import "../../globals.css"
import { HorizontalNavbar, Navbar } from "@/navigation/Navbar";
import PageName from "@/header/PageName";

export const metadata: Metadata = {
  title: "Finance Tracker",
  description: "Personal project to track finances.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        suppressHydrationWarning
        style={{
          height: "100dvh",
          width: "100dvw",
          overflow: "hidden",
          margin: 0,
          padding: 0
        }}
      >
        <Providers>
          <Box 
            sx={{ 
              display: "flex", 
              flexDirection: "row", 
              minWidth: 0,
              minHeight: 0,
              height: "100%"
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
              <Navbar/>
            </Box>

            {/* Main column */}
            <Box 
              sx={{ 
                display: "flex", 
                flex: 1, 
                minWidth: 0, 
                minHeight: 0,
                flexDirection: "column"
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
              
              <Box
                className="flex md:hidden w-full"
              >
                <PageName/>
              </Box>

              {/* Main content */}
              <Box
                component="main"
                sx={{
                  display: "flex",
                  flex: 1,
                  bgcolor: "background.default",
                  color: "text.primary",
                  overflow: "hidden"
                }}
              >
                {/* Inner scroller */}
                <Box
                  className="p-[1rem] lg:p-[2.5rem]"
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    overflowY: "auto",
                    pb: "115px",
                  }}
                >
                  {children}
                </Box>
              </Box>

              {/* Mobile nav */}
              <Box
                className="flex md:hidden"
                component="nav"
                sx={{
                  position: "absolute",
                  bottom: 30,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "95%",
                  zIndex: 1000
                }}
              >
                <HorizontalNavbar/>
              </Box>
            </Box>
          </Box>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
