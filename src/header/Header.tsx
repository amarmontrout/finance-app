"use client"

import ThemeToggle from "@/components/ThemeToggle";
import { Box, Stack, Typography } from "@mui/material";

const Header = () => {
    
  return (
    <Stack
      direction={"row"}
      height={"100px"}
      justifyContent={"space-between"}
    >
      <Box
        alignContent={"center"}
        marginLeft={"50px"}
      >
        <Typography 
        
        variant="h4" >
          The Budgeting App
        </Typography>
      </Box>
      <Box
        alignContent={"center"}
        marginRight={"50px"}
      >
        <ThemeToggle />
      </Box>
    </Stack>
  )
}

export default Header