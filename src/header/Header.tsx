"use client"

import { Box, Stack, Typography } from "@mui/material";
import HeaderDropdown from "./HeaderDropdown";

const Header = () => {
  return (
    <Stack
      direction={"row"}
      height={"100%"}
      justifyContent={"space-between"}
    >
      <Box
        minWidth={"fit-content"}
        alignContent={"center"}
        marginLeft={"1.5rem"}
        marginRight={"5px"}
      >
        <Typography
          variant="h5" 
          color={"white"}
        >
          Finance Tracker
        </Typography>
      </Box>

      <HeaderDropdown/>
    </Stack>
  )
}

export default Header