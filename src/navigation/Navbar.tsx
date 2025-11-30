"use client"

import { Box, Stack, Typography } from "@mui/material"
import PageLink, { PageLinkType } from "./PageLink";
import Logo from "@/components/Logo";

const quickInfo: PageLinkType[] = [
  {"name": "Overview", "link": "/"},
  {"name": "Income", "link": "/income"},
  {"name": "Expenses", "link": "/expenses"},
]

const actions: PageLinkType[] = [
  {"name": "Transactions", "link": "/transactions"},
  {"name": "Set Goals", "link": "#"},
]

const misc: PageLinkType[] = [
  {"name": "Calendar", "link": "#"},
]

const Navbar = () => {
  return (
    <Stack height={"100%"} >
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
        {quickInfo.map((item) => {
          return (
            <PageLink item={item} key={item.name} />
          )
        })}
        <hr style={{ width: "100%" }} />
        <Typography>Actions</Typography>
        {actions.map((item) => {
          return (
            <PageLink item={item} key={item.name} />
          )
        })}
        <hr style={{ width: "100%" }} />
        {misc.map((item) => {
          return (
            <PageLink item={item} key={item.name} />
          )
        })}
      </Stack>
    </Stack>
  )
}

export default Navbar