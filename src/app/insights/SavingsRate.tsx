"use client"

import { useTransactionContext } from "@/contexts/transactions-context"
import { healthStateDarkMode, healthStateLightMode } from "@/globals/colors"
import { getSavingRate } from "@/utils/financialFunctions"
import { getMonthTotal, getYearTotal } from "@/utils/getTotals"
import { cleanNumber } from "@/utils/helperFunctions"
import { Box, Typography } from "@mui/material"
import { useTheme } from "next-themes"
import { useMemo } from "react"

const SavingsRate = (props: {
  selectedYear: string
  selectedMonth: string
}) => {
  const {
    selectedYear,
    selectedMonth
  } = props

  const {
    incomeTransactions,
    expenseTransactions
  } = useTransactionContext()

  const { theme: currentTheme } = useTheme()

  const income = useMemo(() => getMonthTotal(selectedYear, selectedMonth, incomeTransactions), [selectedYear, selectedMonth, incomeTransactions])
  const expense = useMemo(() => getMonthTotal(selectedYear, selectedMonth, expenseTransactions), [selectedYear, selectedMonth, expenseTransactions])
  const savingsRate = useMemo(() => getSavingRate(income, expense), [income, expense])
  const savingsRateNumber = cleanNumber(savingsRate)

  const annualIncome = useMemo(() => getYearTotal(selectedYear, incomeTransactions), [selectedYear, incomeTransactions])
  const annualExpense = useMemo(() => getYearTotal(selectedYear, expenseTransactions), [selectedYear, expenseTransactions])
  const annualSavingsRate = useMemo(() => getSavingRate(annualIncome, annualExpense), [annualIncome, annualExpense])
  const annualSavingsRateNumber = cleanNumber(annualSavingsRate)

  const getHealthState = (rate: number) => {
    if (rate <= 0) return "mayday"
    if (rate < 5) return "improvement"
    if (rate < 20) return "good"
    return "excellent"
  }

  const monthState = getHealthState(savingsRateNumber)
  const annualState = getHealthState(annualSavingsRateNumber)

  const monthResult = currentTheme === "light" ? healthStateLightMode[monthState] : healthStateDarkMode[monthState]
  const annualResult = currentTheme === "light" ? healthStateLightMode[annualState] : healthStateDarkMode[annualState]

  return (
     <Box
      className="flex flex-col gap-3 h-full"
      marginTop={"10px"}
    >
      <Typography variant="h6">A savings rate of over 20% is considered excellent.</Typography>

      <Box
        className="flex flex-row gap-2 h-full"
      >
        <Box 
          className="flex flex-col gap-2 h-full"
          border={`2px solid ${monthResult.border}`}
          borderRadius={"10px"} 
          padding={"15px"} 
          margin={"0 auto"} 
          width={"100%"}
          alignItems={"center"}
          sx={{
            backgroundColor: monthResult.background
          }}
        >
          <Typography 
            color={monthResult.textIcon}
            sx={{
              fontSize: {
                xs: ".75rem",
                md: "1rem"
              }
            }}          
          >
            {`Savings Rate for ${selectedMonth} ${selectedYear}`}
          </Typography>
          
          <hr style={{ width: "100%", borderColor: monthResult.border}}/>
          
          <Typography 
            color={monthResult.textIcon}
            sx={{
              fontSize: {
                xs: "2rem",
                md: "3rem"
              }
            }}          
          >
            {savingsRate}%
          </Typography>
        </Box>

        <Box
          className="flex flex-col gap-2 h-full"
          border={`2px solid ${annualResult.border}`} 
          borderRadius={"10px"} 
          padding={"15px"} 
          margin={"0 auto"} 
          width={"100%"}
          alignItems={"center"}
          sx={{
            backgroundColor: annualResult.background
          }}
        >
          <Typography 
            color={annualResult.textIcon}
            sx={{
              fontSize: {
                xs: ".75rem",
                md: "1rem"
              }
            }}
          >
            {`Total Savings Rate for ${selectedYear}`}
          </Typography>

          <hr style={{ width: "100%", borderColor: annualResult.border}}/>

          <Typography 
            color={annualResult.textIcon}
            sx={{
              fontSize: {
                xs: "2rem",
                md: "3rem"
              }
            }}  
          >
            {annualSavingsRate}%
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default SavingsRate