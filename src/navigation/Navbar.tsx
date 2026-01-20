"use client"

import { Box, Divider, IconButton, Stack, Typography } from "@mui/material"
import PageLink from "./PageLink";
import Logo from "@/components/Logo";
import { 
  NAV_MOBILE,
  NAV_QUICK_INFO, 
  NAV_SETTINGS, 
  NAV_TRANSACTIONS 
} from "@/globals/globals";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { darkMode, lightMode } from "@/globals/colors";
import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export const Navbar = () => {
  const pathname = usePathname()
  const { theme: currentTheme } = useTheme()

  return (
    <Stack height={"100%"} width={"100%"}>
      <Box>
        <Box
          className="hidden md:flex"
          bgcolor={"background.default"} 
          minHeight={"70px"} 
          height={"100%"}
          width={"100%"}
          justifyContent={"center"} 
          alignItems={"center"}
        >
          <Logo/>
        </Box>
      </Box>

      <Stack
        className="p-[.75rem] md:p-[1.25rem]"
        direction={"column"}
        height={"100%"}
        gap={1}
        overflow={"hidden"}
        style={{
          overflowY: "scroll"
        }}
      >
        <Typography 
          className="hidden md:flex" 
          variant={"h5"}
        >
          Quick Info
        </Typography>
        {NAV_QUICK_INFO.map((item) => {
          return (
            <PageLink 
              item={item} 
              active={pathname === item.link} 
              key={item.name}
            />
          )
        })}

        <Divider 
          orientation="horizontal" 
          sx={{ 
            borderColor: currentTheme === "light" ?
              lightMode.borderStrong 
              : darkMode.borderStrong,
            borderRightWidth: 2
          }}
        />

        <Typography 
          className="hidden md:flex" 
          variant={"h5"}
        >
          Transactions
        </Typography>
        {NAV_TRANSACTIONS.map((item) => {
          return (
            <PageLink 
              item={item} 
              active={pathname === item.link} 
              key={item.name}
            />
          )
        })}

        <Divider 
          orientation="horizontal" 
          sx={{ 
            borderColor: currentTheme === "light" ?
              lightMode.borderStrong 
              : darkMode.borderStrong,
            borderRightWidth: 2
          }}
        />

        {NAV_SETTINGS.map((item) => {
          return (
            <PageLink 
              item={item} 
              active={pathname === item.link} 
              key={item.name}
            />
          )
        })}
      </Stack>
    </Stack>
  )
}

export const HorizontalNavbar = () => {
  const pathname = usePathname()
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      width={"100%"}
      gap={1}
    >
      <Box 
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "79px",
          bgcolor: "background.paper",
          borderRadius: "25px",
          boxShadow: 3,
          zIndex: 1000
        }}
      >
        <IconButton
          onClick={() => {
            setOpen(!open)
          }}
        >
          { open?
            <KeyboardArrowUpIcon fontSize={"large"}/>
            : <MenuIcon fontSize={"large"}/>
          }
        </IconButton>
      </Box>

      {open &&
        <Stack
          className="p-[.75rem]"
          direction={"column"}
          gap={1}
          sx={{
            position: "absolute",
            bottom: 90,
            left: "9%",
            transform: "translateX(-50%)",
            bgcolor: "background.paper",
            borderRadius: "25px",
            boxShadow: 3,
          }}
        >
          {NAV_QUICK_INFO.map((item) => {
            if (item.link === "/") return
              return (
                <PageLink 
                  item={item} 
                  active={pathname === item.link} 
                  key={item.name}
                />
              )
            })}
        </Stack>
      }

      <Stack
        className="p-[.75rem]"
        direction={"row"}
        gap={1}
        sx={{
          bgcolor: "background.paper",
          borderRadius: "25px",
          boxShadow: 3,
        }}
      >
        {NAV_MOBILE.map((item) => {
            return (
              <PageLink 
                item={item} 
                active={pathname === item.link} 
                key={item.name}
              />
            )
          })}
      </Stack>
    </Stack>
  )
}