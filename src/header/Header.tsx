"use client"

import ThemeToggle from "@/components/ThemeToggle";
import { Box, Stack, Typography } from "@mui/material";

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

      <Box
        alignContent={"center"}
        marginLeft={"5px"}
        marginRight={"1.5rem"}
      >
        <ThemeToggle />
      </Box>
    </Stack>
  )
}

export default Header