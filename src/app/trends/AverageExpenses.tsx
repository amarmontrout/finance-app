"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import { useTransactionContext } from "@/contexts/transactions-context"
import { darkMode, lightMode } from "@/globals/colors"
import { getAverage } from "@/utils/financialFunctions"
import { cleanNumber, flattenTransactions, formattedStringNumber, getCurrentDateInfo } from "@/utils/helperFunctions"
import { Box, Typography } from "@mui/material"
import { useTheme } from "next-themes"
import { useEffect, useMemo } from "react"

const AverageExpenses = () => {

  const { currentYear } = getCurrentDateInfo()

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

const { currentAvg, prevAvg } = useMemo(() => {
  const flattenedData = flattenTransactions(expenseTransactions)

  const currentAvg: [string, number][] = []
  const prevAvg: [string, number][] = []

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

    currentAvg.push([category, getAverage(currentAmounts)])
    prevAvg.push([category, getAverage(prevAmounts)])
  })

  return { currentAvg, prevAvg }
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
            Expense Categories
          </Typography> 
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

          <ul>
            {currentAvg.map(([category, amount]) => {

              const prevAmount = 
                prevAvg.find(([prevCategory]) => 
                  prevCategory === category
                )?.[1] ?? 0

              const increasedCost = amount > prevAmount

              return (
                <li
                  key={category}
                  className="flex items-center justify-between"
                >
                  <Typography 
                    className="sm:hidden"
                    variant="h6"
                    color={increasedCost ? badColor : goodColor}
                  >
                    {`${category}`}
                  </Typography>

                  <Typography 
                    variant="h6"
                    color={increasedCost ? badColor : goodColor}
                  >
                    {`$${formattedStringNumber(amount)}`}
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