"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import { FlexChildWrapper, FlexColWrapper } from "@/components/Wrappers"
import { Choice } from "@/contexts/categories-context"
import { FlatTransaction } from "@/contexts/transactions-context"
import { darkMode, lightMode } from "@/globals/colors"
import { MONTHS } from "@/globals/globals"
import { getAverage } from "@/utils/financialFunctions"
import { cleanNumber, formattedStringNumber } from "@/utils/helperFunctions"
import { Typography } from "@mui/material"
import { useMemo } from "react"

const AverageExpenses = ({
  flatExpenseTransactions,
  expenseCategories,
  currentTheme,
  currentYear,
  currentMonth
}: {
  flatExpenseTransactions: FlatTransaction[]
  expenseCategories: Choice[]
  currentTheme: string | undefined
  currentYear: string
  currentMonth: string
}) => {
  const badColor = currentTheme === "light" ?
    lightMode.error 
    : darkMode.error
  const goodColor = currentTheme === "light" ?
    lightMode.success 
    : darkMode.success
  const { currentAvg, prevAvg, percentChangeAvg } = useMemo(() => {
    const passedMonths = MONTHS.indexOf(currentMonth) + 1

    const currentAvg: [string, number][] = []
    const prevAvg: [string, number][] = []
    const percentChangeAvg: [string, number][] = []

    expenseCategories.forEach((category) => {
      // ---- CURRENT YEAR ----
      const currentMonthTotals: Record<string, number> = {}
      flatExpenseTransactions.forEach((t) => {
        if (
          t.category === category.name &&
          t.year === currentYear &&
          MONTHS.indexOf(t.month) + 1 <= passedMonths
        ) {
          currentMonthTotals[t.month] =
            (currentMonthTotals[t.month] ?? 0) + cleanNumber(t.amount)
        }
      })
      const currentAmounts = MONTHS
        .slice(0, passedMonths)
        .map((month) => currentMonthTotals[month] ?? 0)
      const currentAverage = getAverage(currentAmounts)

      // ---- PREVIOUS YEAR ----
      const prevMonthTotals: Record<string, number> = {}
      flatExpenseTransactions.forEach((t) => {
        if (
          t.category === category.name &&
          Number(t.year) === Number(currentYear) - 1
        ) {
          prevMonthTotals[t.month] =
            (prevMonthTotals[t.month] ?? 0) + cleanNumber(t.amount)
        }
      })
      const prevAmounts = MONTHS.map(
        (month) => prevMonthTotals[month] ?? 0
      )
      const prevAverage = getAverage(prevAmounts)

      currentAvg.push([category.name, currentAverage])
      prevAvg.push([category.name, prevAverage])
      percentChangeAvg.push([category.name, currentAverage - prevAverage])
    })

    return { currentAvg, prevAvg, percentChangeAvg }
  }, [flatExpenseTransactions, expenseCategories, currentYear, currentMonth])

  return (
    <ShowCaseCard title={"Expense Averages"}>
      <FlexColWrapper gap={5} toRowBreak={"sm"}>
        <FlexChildWrapper gap={1} hiddenToVisibleBp={"sm"}>
          <Typography textAlign={"center"}>
            Categories
          </Typography> 

          <hr/>

          <ul>
            {expenseCategories.map((category) => (
              <li
                key={category.name}
                className="flex items-center justify-between"
              >
                <Typography 
                  className="hidden sm:flex"
                  variant="h6"
                >
                  {`${category.name}`}
                </Typography>
              </li>
            ))}
          </ul>
        </FlexChildWrapper>

        <FlexChildWrapper gap={1}>
          <Typography textAlign={"center"}>
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
                <Typography variant="h6">
                  {`$${formattedStringNumber(amount)}`}
                </Typography>
              </li>
            ))}
          </ul>
        </FlexChildWrapper>

        <FlexChildWrapper gap={1}>
          <Typography textAlign={"center"}>
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
        </FlexChildWrapper>

        <FlexChildWrapper gap={1}>
          <Typography textAlign={"center"}>
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
                    color={diff <= 0 ? goodColor : badColor}
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
        </FlexChildWrapper>
      </FlexColWrapper>
    </ShowCaseCard>
  )
}

export default AverageExpenses