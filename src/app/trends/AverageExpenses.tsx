"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import { useTransactionContext } from "@/contexts/transactions-context"
import { darkMode, lightMode } from "@/globals/colors"
import { MONTHS } from "@/globals/globals"
import { getAverage, getDifference } from "@/utils/financialFunctions"
import { cleanNumber, flattenTransactions, formattedStringNumber, getCurrentDateInfo } from "@/utils/helperFunctions"
import { Box, Typography } from "@mui/material"
import { useTheme } from "next-themes"
import { useEffect, useMemo } from "react"

const AverageExpenses = () => {

  const { currentYear, currentMonth } = getCurrentDateInfo()
  const { theme: currentTheme } = useTheme()

  const badColor = currentTheme === "light" ? lightMode.error : darkMode.error
  const goodColor = currentTheme === "light" ? lightMode.success : darkMode.success

  const {
    refreshExpenseTransactions,
    expenseTransactions,
    expenseCategories,
    refreshExpenseCategoryChoices
  } = useTransactionContext()

  useEffect(() => {
    refreshExpenseTransactions()
    refreshExpenseCategoryChoices()
  }, [])

  const { currentAvg, prevAvg, percentChangeAvg } = useMemo(() => {
    const flattenedData = flattenTransactions(expenseTransactions)

    const currentAvg: [string, number][] = []
    const prevAvg: [string, number][] = []
    const percentChangeAvg: [string, number][] = []

    expenseCategories.forEach((category) => {
      const currentAmounts: number[] = []
      const prevAmounts: number[] = []

      flattenedData.forEach((t) => {
        if (t.category !== category) return

        if (t.year === currentYear) {
          currentAmounts.push(cleanNumber(t.amount))
        }

        if (Number(t.year) === Number(currentYear) - 1) {
          prevAmounts.push(cleanNumber(t.amount))
        }
      })

      const currentAverage = getAverage(currentAmounts, MONTHS.indexOf(currentMonth)+1)
      const prevAverage = getAverage(prevAmounts, 12)

      currentAvg.push([category, currentAverage])
      prevAvg.push([category, prevAverage])
      percentChangeAvg.push([category, getDifference(prevAverage, currentAverage)])
    })

    return { currentAvg, prevAvg, percentChangeAvg }
  }, [expenseTransactions, expenseCategories, currentYear])

  return (
    <ShowCaseCard title={"Average Monthly Expenses"}>
      <Box
        className="flex flex-col sm:flex-row gap-5"
      >
        <Box
          className="hidden sm:flex flex-col gap-1 sm:w-[50%]"
        >
          <Typography
            textAlign={"center"}
          >
            Categories
          </Typography> 

          <hr/>

          <ul>
            {expenseCategories.map((category) => (
              <li
                key={category}
                className="flex items-center justify-between"
              >
                <Typography 
                  className="hidden sm:flex"
                  variant="h6"
                >
                  {`${category}`}
                </Typography>
              </li>
            ))}
          </ul>      
        </Box>

        <Box
          className="flex flex-col gap-1 sm:w-[50%]"
        >
          <Typography
            textAlign={"center"}
          >
            {Number(currentYear)-1}
          </Typography> 

          <hr/>

          <ul>
            {prevAvg.map(([category, amount]) => (
              <li
                key={category}
                className="flex items-center justify-between"
              >
                <Typography 
                  className="sm:hidden"
                  variant="h6"
                >
                  {`${category}`}
                </Typography>
                <Typography variant="h6">{`$${formattedStringNumber(amount)}`}</Typography>
              </li>
            ))}
          </ul>      
        </Box>

        <Box
          className="flex flex-col gap-1 sm:w-[50%]"
        >
          <Typography
            textAlign={"center"}
          >
            {currentYear}
          </Typography>

          <hr/>

          <ul>
            {currentAvg.map(([category, amount]) => {
              return (
                <li
                  key={category}
                  className="flex items-center justify-between"
                >
                  <Typography 
                    className="sm:hidden"
                    variant="h6"
                  >
                    {`${category}`}
                  </Typography>

                  <Typography 
                    variant="h6"
                  >
                    {`$${formattedStringNumber(amount)}`}
                  </Typography>
                </li>
              )
            })}
          </ul>
        </Box>

        <Box
          className="flex flex-col gap-1 sm:w-[50%]"
        >
          <Typography
            textAlign={"center"}
          >
            Change
          </Typography>

          <hr/>

          <ul>
            {percentChangeAvg.map(([category, diff]) => {
              return (
                <li
                  key={category}
                  className="flex items-center justify-between"
                >
                  <Typography 
                    className="sm:hidden"
                    variant="h6"
                  >
                    {`${category}`}
                  </Typography>

                  <Typography 
                    variant="h6"
                    color={diff < 0 ? goodColor : badColor}
                  >
                    {
                    `${diff < 0 ? '-' : '+'}
                    $${formattedStringNumber(Math.abs(diff))}`
                    }
                  </Typography>
                </li>
              )
            })}
          </ul>
        </Box>        
      </Box>
    </ShowCaseCard>
  )
}

export default AverageExpenses