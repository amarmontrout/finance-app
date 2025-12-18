"use client"

import ThemeToggle from "@/components/ThemeToggle";
import { useTransactionContext } from "@/contexts/transactions-context";
import { Alert, Box, Stack, Typography } from "@mui/material";

const Header = () => {

  const { isMockData } = useTransactionContext()

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
        sx={{
          display: isMockData? "flex" : "none",
          height: "100%",
          alignItems: "center"
        }}
      >
        <Alert severity="warning" sx={{height: "fit-content"}}>
          This contains mock data. Enter Income and Expenses to get start tracking your finances.
        </Alert>
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