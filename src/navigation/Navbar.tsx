"use client"

import { Box, Divider, IconButton, Stack, Typography } from "@mui/material"
import PageLink from "./PageLink";
import Logo from "@/components/Logo";
import { 
  NAV_QUICK_INFO, 
  NAV_SETTINGS, 
  NAV_TRANSACTIONS 
} from "@/globals/globals";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { darkMode, lightMode } from "@/globals/colors";
import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

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
    >
      <Box 
        className="p-[.25rem]"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "67px",
          bgcolor: "rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(4px) saturate(160%)",
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
            <KeyboardArrowRightIcon fontSize={"large"}/>
            : <MenuIcon fontSize={"large"}/>
          }
        </IconButton>
      </Box>

      <Stack
        className="p-[.5rem]"
        direction={"row"}
        gap={1}
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(4px) saturate(160%)",
          borderRadius: "25px",
          boxShadow: 3,
        }}
      >
        {NAV_QUICK_INFO.map((item) => {
          if (item.link !== "/") return
            return (
              <PageLink 
                item={item} 
                active={pathname === item.link} 
                key={item.name}
              />
            )
          })}
        {!open && NAV_TRANSACTIONS.map((item) => {
            return (
              <PageLink 
                item={item} 
                active={pathname === item.link} 
                key={item.name}
              />
            )
          })}
        {open && NAV_QUICK_INFO.map((item) => {
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

      <Box
        className="p-[.5rem]"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(4px) saturate(160%)",
          borderRadius: "25px",
          boxShadow: 3,
          zIndex: 1000
        }}
      >
        {NAV_SETTINGS.map((item) => {
          return (
            <PageLink 
              item={item} 
              active={pathname === item.link} 
              key={item.name}
            />
          )
        })}
      </Box>
    </Stack>
  )
}