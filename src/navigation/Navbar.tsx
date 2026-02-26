"use client"

import { Box, Divider, Stack, Typography } from "@mui/material"
import Logo from "@/components/Logo"
import { NAV_QUICK_INFO, NAV_TRANSACTIONS } from "@/globals/globals"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { darkMode, lightMode } from "@/globals/colors"
import { HorizontalPageLink, PageLink } from "./PageLink"

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

        <Typography className="hidden md:flex" variant={"h5"}>
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
      </Stack>
    </Stack>
  )
}

export const HorizontalNavbar = () => {
  const pathname = usePathname()

  return (
    <Stack
      className="p-[.25rem] w-full"
      direction={"row"}
      spacing={1}
      width={"100%"}
    >
      {NAV_QUICK_INFO.map((item) => {
        return (
          <HorizontalPageLink
            item={item}
            active={pathname === item.link}
            key={item.name}
          />
        )
      })}
      {NAV_TRANSACTIONS.map((item) => {
        return (
          <HorizontalPageLink
            item={item}
            active={pathname === item.link}
            key={item.name}
          />
        )
      })}
    </Stack>
  )
}
