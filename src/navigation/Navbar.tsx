"use client"

import Logo from "@/components/Logo"
import { darkMode, lightMode } from "@/globals/colors"
import { NAV_MOBILE, NAV_QUICK_INFO, NAV_TRANSACTIONS } from "@/globals/globals"
import { Box, Divider, Stack, Typography } from "@mui/material"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { HorizontalPageLink, PageLink } from "./PageLink"

export const Navbar = () => {
  const pathname = usePathname()
  const { theme: currentTheme } = useTheme()

  return (
    <Stack height={"100%"} width={"100%"}>
      <Box>
        <Box
          className="hidden sm:flex"
          bgcolor={"background.default"}
          minHeight={"70px"}
          height={"100%"}
          width={"100%"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Logo />
        </Box>
      </Box>

      <Stack
        className="p-[.75rem] md:p-[1.25rem]"
        direction={"column"}
        height={"100%"}
        gap={1}
        overflow={"hidden"}
        style={{
          overflowY: "scroll",
        }}
      >
        <Typography className="hidden md:flex" variant={"h5"}>
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
            borderColor:
              currentTheme === "light"
                ? lightMode.borderStrong
                : darkMode.borderStrong,
            borderRightWidth: 2,
          }}
        />

        {/* <Typography className="hidden md:flex" variant={"h5"}>
          Transactions
        </Typography> */}
        {NAV_TRANSACTIONS.map((item) => {
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

  return (
    <Stack
      direction="row"
      justifyContent="space-around"
      alignItems="top"
      height="100%"
      width={"100%"}
      px={1}
    >
      {NAV_MOBILE.map((item) => (
        <HorizontalPageLink
          item={item}
          active={pathname === item.link}
          key={item.name}
        />
      ))}
    </Stack>
  )
}
