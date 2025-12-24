"use client"

import ColoredInfoCard from "@/components/ColoredInfoCard"
import MockDataWarning from "@/components/MockDataWarning"
import PieChart from "@/components/PieChart"
import ShowCaseCard from "@/components/ShowCaseCard"
import { useTransactionContext } from "@/contexts/transactions-context"
import { healthStateDarkMode, healthStateLightMode } from "@/globals/colors"
import { MONTHS } from "@/globals/globals"
import { mockExpenseData, mockIncomeData, mockYears } from "@/globals/mockData"
import { getAnnualCategoryTotals, getMonthCategoryTotals } from "@/utils/getTotals"
import { flattenTransactions, formattedStringNumber, getCurrentDateInfo } from "@/utils/helperFunctions"
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material"
import { useTheme } from "next-themes"
import { useEffect, useMemo, useState } from "react"

const Categories = () => {
  const { 
    incomeTransactions, 
    refreshIncomeTransactions,
    expenseTransactions, 
    refreshExpenseTransactions,
    years,
    isMockData,
  } = useTransactionContext()
  const { theme: currentTheme } = useTheme()
  const { currentYear, currentMonth } = getCurrentDateInfo()

  const [selectedYear, setSelectedYear] = useState<string>(currentYear)
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth)
  const [view, setView] = useState<"annual" | "month">("month")

  useEffect(() => {
    refreshIncomeTransactions()
    refreshExpenseTransactions()
  }, [selectedYear])

  const incomeSource = isMockData ? mockIncomeData : incomeTransactions
  const expenseSource = isMockData ? mockExpenseData : expenseTransactions

  const flattenedIncomeData = useMemo(() => flattenTransactions(incomeSource),[incomeSource])
  const flattenedExpenseData = useMemo(() => flattenTransactions(expenseSource),[expenseSource])

  const annualIncomeCategoryTotals = useMemo(
    () => getAnnualCategoryTotals(
      selectedYear, 
      flattenedIncomeData)
    ,[flattenedIncomeData, selectedYear]
  )

  const annualExpenseCategoryTotals = useMemo(
    () => getAnnualCategoryTotals(
      selectedYear, 
      flattenedExpenseData)
    ,[flattenedExpenseData, selectedYear]
  )

  const monthIncomeCategoryTotals = useMemo(
    () => getMonthCategoryTotals(
      selectedYear, 
      selectedMonth, 
      flattenedIncomeData)
    ,[selectedYear, selectedMonth, flattenedIncomeData]
  )

  const monthExpenseCategoryTotals = useMemo(
    () => getMonthCategoryTotals(
      selectedYear, 
      selectedMonth, 
      flattenedExpenseData)
    ,[selectedYear, selectedMonth, flattenedExpenseData]
  )

  const topThreeExpenses = useMemo(() => {
    if (view !== "month") return []

    if (!monthExpenseCategoryTotals || monthExpenseCategoryTotals.length <= 1) {
      return []
    }

    return monthExpenseCategoryTotals
      .slice(1)
      .sort((a, b) => Number(b[1]) - Number(a[1]))
      .slice(0, 3)
  }, [monthExpenseCategoryTotals, view])

  const defaultCardColor = (currentTheme === "light" 
    ? healthStateLightMode
    : healthStateDarkMode)["default"]

  return (
    <Box
      className="flex flex-col gap-2 h-full"
    >
      <MockDataWarning/>

      <Box
        className="flex flex-col sm:flex-row gap-3 h-full"
        width={"fit-content"}
        paddingTop={"10px"}
      >
        <FormControl>
          <InputLabel>View</InputLabel>
          <Select
            label="View"
            value={view}
            name={"view"}
            onChange={e => setView(e.target.value)}
            sx={{
              width: "175px"
            }}
          >
            <MenuItem key={"annual"} value={"annual"}>By Year</MenuItem>
            <MenuItem key={"month"} value={"month"}>By Month</MenuItem>
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Year</InputLabel>
          <Select
            label="Year"
            value={selectedYear}
            name={"year"}
            onChange={e => setSelectedYear(e.target.value)}
            sx={{
              width: "175px"
            }}
          >
            { isMockData ?
              mockYears.map((year) => {
                return <MenuItem key={year} value={year}>{year}</MenuItem>
              })
              : years.map((year) => {
                return <MenuItem key={year} value={year}>{year}</MenuItem>
              })
            }
          </Select>
        </FormControl>

        {view === "month" &&
          <FormControl>
            <InputLabel>Month</InputLabel>
            <Select
              label="Month"
              value={selectedMonth}
              name={"month"}
              onChange={e => setSelectedMonth(e.target.value)}
              sx={{
                width: "175px"
              }}
            >
              {
              MONTHS.map((month) => {
                  return <MenuItem key={month} value={month}>{month}</MenuItem>
                })
              }
            </Select>
          </FormControl>
        }
      </Box>

      <hr style={{width: "100%"}}/>

      {view === "annual" &&
        <Box
          className="flex flex-col xl:flex-row gap-2 h-full"
        >
          <ShowCaseCard title={`${selectedYear} Income Category Breakdown`}>
            <PieChart
              data={annualIncomeCategoryTotals}
            />
          </ShowCaseCard>

          <ShowCaseCard title={`${selectedYear} Expense Category Breakdown`}>
            <PieChart
              data={annualExpenseCategoryTotals}
            />
          </ShowCaseCard>
        </Box>
      }
      
      {view === "month" &&
        <Box
          className="flex flex-col gap-2 h-full"
        >
          <ShowCaseCard title={`Top 3 Expenses for ${selectedMonth} ${selectedYear}`}>
            <Box
              className="flex flex-col lg:flex-row gap-2 h-full"
            >
              {topThreeExpenses.map(([category, amount], idx) => (
                <ColoredInfoCard
                  key={category}
                  cardColors={defaultCardColor}
                  info={`$${formattedStringNumber(Number(amount))}`}
                  title={`${idx+1}) ${category}`}
                />
              ))}
            </Box>
          </ShowCaseCard>

          <Box
            className="flex flex-col xl:flex-row gap-2 h-full"
          >
            <ShowCaseCard title={`${selectedMonth} ${selectedYear} Income Category Breakdown`}>
              <PieChart
                data={monthIncomeCategoryTotals}
              />
            </ShowCaseCard>

            <ShowCaseCard title={`${selectedMonth} ${selectedYear} Expense Category Breakdown`}>
              <PieChart
                data={monthExpenseCategoryTotals}
              />
            </ShowCaseCard>
          </Box>
        </Box>
      }
    </Box>
  )
}

export default Categories