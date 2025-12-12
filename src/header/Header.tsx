"use client"

import ThemeToggle from "@/components/ThemeToggle";
import { Box, Drawer, IconButton, Stack, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import Navbar from "@/navigation/Navbar";

const Header = () => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Stack
      direction={"row"}
      height={"100px"}
      justifyContent={"space-between"}
    >
      <Box
        className="absolute block lg:hidden"
        sx={{
          height:"100px",
          width: "50px",
          alignContent: "center",
          textAlign: "center"
        }}
      >
        <IconButton
          onClick={() => {setOpen(true)}}
        >
          <MenuIcon
            className="color: black"
          />
        </IconButton>
        
      </Box>
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
      <Drawer open={open} onClose={() => {setOpen(false)}}>
        <Navbar/>
      </Drawer>
    </Stack>
  )
}

export default Header