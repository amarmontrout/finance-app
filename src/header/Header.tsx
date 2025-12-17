"use client"

import ThemeToggle from "@/components/ThemeToggle";
import { Box, Stack, Typography } from "@mui/material";

const Header = () => {
  return (
    <Stack
      direction={"row"}
      height={"80px"}
      justifyContent={"space-between"}
    >
      <Box
        minWidth={"165px"}
        alignContent={"center"}
        marginLeft={"50px"}
        marginRight={"25px"}
      >
        <Typography variant="h4" color={"white"}>
          My Budget
        </Typography>
      </Box>
      <Box
        alignContent={"center"}
        marginLeft={"25px"}
        marginRight={"50px"}
      >
        <ThemeToggle />
      </Box>
    </Stack>
  )
}

export default Header