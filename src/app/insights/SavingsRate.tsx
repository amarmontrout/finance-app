"use client"

import { useTransactionContext } from "@/contexts/transactions-context"
import { accentColorSecondary, darkMode, lightMode } from "@/globals/colors"
import { getNetCashFlow, getSavingRate } from "@/utils/getTotals"
import { cleanNumber } from "@/utils/helperFunctions"
import { Box, Typography } from "@mui/material"
import { useTheme } from "next-themes"

const SavingsRate = () => {
  const {
    selectedMonth,
    selectedYear,
    getMonthIncomeTotal,
    getMonthExpenseTotal
  } = useTransactionContext()

  const income = getMonthIncomeTotal()
  const expense = getMonthExpenseTotal()
  const savingsRate = getSavingRate(income, expense)

  // Net income is currently used for border color
  const netIncome = getNetCashFlow(income, expense)
  const netIncomeNumber = cleanNumber(netIncome)

  const theme = useTheme()
  const currentTheme = theme.theme
  const positiveNet = currentTheme === "light" ? lightMode.success : darkMode.success
  const negativeNet = currentTheme === "light" ? lightMode.error : darkMode.error
  const textAndBorderColor = netIncomeNumber > 0 ? positiveNet : negativeNet

  return (
    <Box 
      className="flex flex-col gap-2 h-full"
      border={`2px solid ${textAndBorderColor}`}
      borderRadius={"10px"} 
      padding={"15px"} 
      margin={"0 auto"} 
      width={"fit-content"}
      alignItems={"center"}
    >
      <Typography color={textAndBorderColor}>{`Savings Rate for ${selectedMonth} ${selectedYear}`}</Typography>
      <hr style={{ width: "100%", borderColor: textAndBorderColor}}/>
      <Typography variant="h3" color={textAndBorderColor}>{savingsRate}%</Typography>
    </Box>
  )
}

export default SavingsRate