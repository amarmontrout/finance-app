"use client"

import DateSelector from "@/components/DateSelector"
import MockDataWarning from "@/components/MockDataWarning"
import { useTransactionContext } from "@/contexts/transactions-context"
import { healthStateDarkMode, healthStateLightMode } from "@/globals/colors"
import { mockExpenseData, mockIncomeData } from "@/globals/mockData"
import { getAnnualCategoryTotals, getMonthCategoryTotals } from "@/utils/getTotals"
import { flattenTransactions, getCurrentDateInfo } from "@/utils/helperFunctions"
import { useTheme } from "next-themes"
import { useEffect, useMemo, useState } from "react"
import MonthlyCategoryBreakdown from "./MonthlyCategoryBreakdown"
import AnnualCategoryBreakdown from "./AnnualCategoryBreakdown"
import { FlexColWrapper } from "@/components/Wrappers"

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
    <FlexColWrapper gap={2}>
      <MockDataWarning/>

      <DateSelector
        view={view}
        setView={setView}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        years={years}
        isMockData={isMockData}
      />

      <hr style={{width: "100%"}}/>

      {view === "annual" &&
        <AnnualCategoryBreakdown
          selectedYear={selectedYear}
          annualIncomeCategoryTotals={annualIncomeCategoryTotals}
          annualExpenseCategoryTotals={annualExpenseCategoryTotals}
        />
      }
      
      {view === "month" &&
        <MonthlyCategoryBreakdown
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          monthIncomeCategoryTotals={monthIncomeCategoryTotals}
          monthExpenseCategoryTotals={monthExpenseCategoryTotals}
          topThreeExpenses={topThreeExpenses}
          defaultCardColor={defaultCardColor}
        />
      }
    </FlexColWrapper>
  )
}

export default Categories