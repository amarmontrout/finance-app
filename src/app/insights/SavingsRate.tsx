"use client"

import { useTransactionContext } from "@/contexts/transactions-context"
import { darkMode, lightMode } from "@/globals/colors"
import { getSavingRate, getYearTotal } from "@/utils/getTotals"
import { cleanNumber } from "@/utils/helperFunctions"
import { Box, Typography } from "@mui/material"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const SavingsRate = () => {
  const {
    selectedMonth,
    selectedYear,
    getMonthIncomeTotal,
    getMonthExpenseTotal,
    incomeTransactions,
    expenseTransactions
  } = useTransactionContext()

  const income = getMonthIncomeTotal()
  const expense = getMonthExpenseTotal()
  const savingsRate = getSavingRate(income, expense)
  const savingsRateNumber = cleanNumber(savingsRate)

  const [totalAnnualSavingsRate, setTotalAnnualSavingsRate] = useState<string>("")
  const totalAnnualSavingsRateNumber = cleanNumber(totalAnnualSavingsRate)

  const theme = useTheme()
  const currentTheme = theme.theme
  const positiveNet = currentTheme === "light" ? lightMode.success : darkMode.success
  const negativeNet = currentTheme === "light" ? lightMode.error : darkMode.error
  const monthNetIncomeColor = savingsRateNumber > 0 ? positiveNet : negativeNet
  const annualSavingsRateColor = totalAnnualSavingsRateNumber > 0 ? positiveNet : negativeNet

  const getAnnualSavingsRate = () => {
    const incomeYearTotal = getYearTotal(selectedYear, incomeTransactions)
    const expenseYearTotal = getYearTotal(selectedYear, expenseTransactions)
    const annualSavingsRate = getSavingRate(incomeYearTotal, expenseYearTotal)
    setTotalAnnualSavingsRate(annualSavingsRate)
  }

  useEffect(() => {
    getAnnualSavingsRate()
  }, [savingsRate])

  return (
     <Box
      className="flex flex-row gap-2 h-full"
      marginTop={"10px"}
    >
      <Box 
        className="flex flex-col gap-2 h-full"
        border={`2px solid ${monthNetIncomeColor}`}
        borderRadius={"10px"} 
        padding={"15px"} 
        margin={"0 auto"} 
        width={"fit-content"}
        alignItems={"center"}
      >
        <Typography color={monthNetIncomeColor}>{`Savings Rate for ${selectedMonth} ${selectedYear}`}</Typography>
        <hr style={{ width: "100%", borderColor: monthNetIncomeColor}}/>
        <Typography variant="h3" color={monthNetIncomeColor}>{savingsRate}%</Typography>
      </Box>

      <Box
        className="flex flex-col gap-2 h-full"
        border={`2px solid ${annualSavingsRateColor}`} 
        borderRadius={"10px"} 
        padding={"15px"} 
        margin={"0 auto"} 
        width={"fit-content"}
        alignItems={"center"}
      >
        <Typography color={annualSavingsRateColor}>{`Total Savings Rate for ${selectedYear}`}</Typography>
        <hr style={{ width: "100%", borderColor: annualSavingsRateColor}}/>
        <Typography variant="h3" color={annualSavingsRateColor}>{totalAnnualSavingsRate}%</Typography>
      </Box>
    </Box>
  )
}

export default SavingsRate