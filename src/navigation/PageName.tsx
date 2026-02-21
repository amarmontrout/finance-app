"use client"

import { NAV_QUICK_INFO, NAV_SETTINGS, NAV_TRANSACTIONS } from "@/globals/globals"
import { Box, Typography } from "@mui/material"
import { usePathname } from "next/navigation"

const PageName = () => {
  let pathname = usePathname()
  const ALL_NAV_ITEMS = [
    ...NAV_QUICK_INFO,
    ...NAV_TRANSACTIONS,
    ...NAV_SETTINGS
  ]
  const activeTab = ALL_NAV_ITEMS.find(item => item.link === pathname)
  if (!activeTab) return
  return (
    <Box
      width={"100%"}
      textAlign={"center"}
    >
      <Typography variant={"h6"} fontWeight={"bold"}>
        {activeTab.name}
      </Typography>
    </Box>
  )
}

export default PageName