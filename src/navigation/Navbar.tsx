"use client"

import { linkStyle, navSelection } from "@/globals/styles"
import { Box, Stack, Typography } from "@mui/material"
import PaidIcon from '@mui/icons-material/Paid';
import SavingsIcon from '@mui/icons-material/Savings';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Link from "next/link"

const Navbar = () => {

  return (
    <Stack height={"100%"} >
      <Box minHeight={"100px"} bgcolor={"background.default"} textAlign={"center"} alignContent={"center"}>
        <PaidIcon fontSize={"large"} />
        <SavingsIcon fontSize={"large"} />
        <CreditCardIcon fontSize={"large"} />
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
        <Link style={linkStyle} href={"/"} ><Box sx={navSelection} ><Typography variant={"h5"} >Overview</Typography></Box></Link>
        <Link style={linkStyle} href={"/income"} ><Box sx={navSelection} ><Typography variant={"h5"} >Income</Typography></Box></Link>
        <Link style={linkStyle} href={"/expenses"} ><Box sx={navSelection} ><Typography variant={"h5"} >Expenses</Typography></Box></Link>
        <hr style={{ width: "100%" }} />
        <Typography>Actions</Typography>
        <Link style={linkStyle} href={"#"} ><Box sx={navSelection} ><Typography variant={"h5"} >Enter Income</Typography></Box></Link>
        <Link style={linkStyle} href={"#"} ><Box sx={navSelection} ><Typography variant={"h5"} >Enter Expense</Typography></Box></Link>
        <Link style={linkStyle} href={"#"} ><Box sx={navSelection} ><Typography variant={"h5"} >Set Goals</Typography></Box></Link>
        <hr style={{ width: "100%" }} />
        <Link style={linkStyle} href={"#"} ><Box sx={navSelection} ><Typography variant={"h5"} >Calendar</Typography></Box></Link>
        <Link style={linkStyle} href={"#"} ><Box sx={navSelection} ><Typography variant={"h5"} >Categories</Typography></Box></Link>
      </Stack>
    </Stack>
  )
}

export default Navbar