"use client"

import { Box, IconButton, Stack, Typography } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import PageLink from "./PageLink";
import Logo from "@/components/Logo";
import { 
  NAV_QUICK_INFO, 
  NAV_SETTINGS, 
  NAV_TRANSACTIONS 
} from "@/globals/globals";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState<boolean>(true)
  const pathname = usePathname()

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

        <Box
          className="flex md:hidden"
          bgcolor={"background.default"} 
          minHeight={"70px"} 
          height={"100%"}
          width={"100%"}
          justifyContent={"center"} 
          alignItems={"center"}
        >
          <IconButton>
            <MenuIcon fontSize="large"/>
          </IconButton>
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

        <hr style={{ width: "100%" }} />

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

        <hr style={{ width: "100%" }} />

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

export default Navbar