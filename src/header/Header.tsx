"use client"

import { Box, Stack, Typography } from "@mui/material"
import HeaderDropdown from "./HeaderDropdown"
import { neutralColor } from "@/globals/colors"

const Header = () => {
  return (
    <Stack direction={"row"} height={"100%"} justifyContent={"space-between"}>
      <Box
        minWidth={"fit-content"}
        alignContent={"center"}
        marginLeft={"1rem"}
        marginRight={"5px"}
      >
        <Typography variant="h5" color={neutralColor.color} fontWeight={600}>
          My Finances
        </Typography>
      </Box>

      <HeaderDropdown />
    </Stack>
  )
}

export default Header
