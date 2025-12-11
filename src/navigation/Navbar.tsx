"use client"

import { Box, Stack, Typography } from "@mui/material"
import PageLink from "./PageLink";
import Logo from "@/components/Logo";
import { NAV_ACTIONS, NAV_MISC, NAV_QUICKINFO } from "@/globals/globals";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname()

  return (
    <Stack height={"100%"} width={"250px"}>
      <Box 
        display={"flex"} 
        minHeight={"100px"} 
        bgcolor={"background.default"} 
        justifyContent={"center"} 
        alignItems={"center"}
      >
        <Logo/>
      </Box>
      <Stack
        direction={"column"}
        height={"100%"}
        gap={1}
        padding={"30px"}
        overflow={"hidden"}
        style={{
          overflowY: "scroll"
        }}
      >
        <Typography>Quick Info</Typography>
        {NAV_QUICKINFO.map((item) => {
          return (
            <PageLink item={item} active={pathname === item.link} key={item.name} />
          )
        })}
        <hr style={{ width: "100%" }} />
        <Typography>Actions</Typography>
        {NAV_ACTIONS.map((item) => {
          return (
            <PageLink item={item} active={pathname === item.link} key={item.name} />
          )
        })}
        <hr style={{ width: "100%" }} />
        {NAV_MISC.map((item) => {
          return (
            <PageLink item={item} active={pathname === item.link} key={item.name} />
          )
        })}
      </Stack>
    </Stack>
  )
}

export default Navbar