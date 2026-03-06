"use client"

import DateSelector from "@/components/DateSelector"
import { useTransactionContext } from "@/contexts/transactions-context"
import {
  getAnnualCategoryTotals,
  getMonthCategoryTotals,
} from "@/utils/getTotals"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import { useEffect, useMemo, useState } from "react"
import MonthlyCategoryBreakdown from "./MonthlyCategoryBreakdown"
import AnnualCategoryBreakdown from "./AnnualCategoryBreakdown"
import { FlexColWrapper } from "@/components/Wrappers"
import { useCategoryContext } from "@/contexts/categories-context"

const Categories = () => {
  const {
    incomeTransactions,
    refreshIncomeTransactions,
    expenseTransactions,
    refreshExpenseTransactions,
  } = useTransactionContext()
  const { years } = useCategoryContext()
  const { currentYear, currentMonth } = getCurrentDateInfo()

  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth)
  const [view, setView] = useState<"annual" | "month">("month")

  useEffect(() => {
    refreshIncomeTransactions()
    refreshExpenseTransactions()
  }, [selectedYear])

  const annualIncomeCategoryTotals = useMemo(
    () => getAnnualCategoryTotals(selectedYear, incomeTransactions),
    [incomeTransactions, selectedYear],
  )
  const annualExpenseCategoryTotals = useMemo(
    () => getAnnualCategoryTotals(selectedYear, expenseTransactions),
    [expenseTransactions, selectedYear],
  )

  const monthIncomeCategoryTotals = useMemo(
    () =>
      getMonthCategoryTotals(selectedYear, selectedMonth, incomeTransactions),
    [selectedYear, selectedMonth, incomeTransactions],
  )
  const monthExpenseCategoryTotals = useMemo(
    () =>
      getMonthCategoryTotals(selectedYear, selectedMonth, expenseTransactions),
    [selectedYear, selectedMonth, expenseTransactions],
  )

  return (
    <FlexColWrapper gap={2}>
      <DateSelector
        view={view}
        setView={setView}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        years={years}
      />

      <hr style={{ width: "100%" }} />

      {view === "annual" && (
        <AnnualCategoryBreakdown
          selectedYear={selectedYear}
          annualIncomeCategoryTotals={annualIncomeCategoryTotals}
          annualExpenseCategoryTotals={annualExpenseCategoryTotals}
        />
      )}

      {view === "month" && (
        <MonthlyCategoryBreakdown
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          monthIncomeCategoryTotals={monthIncomeCategoryTotals}
          monthExpenseCategoryTotals={monthExpenseCategoryTotals}
        />
      )}
    </FlexColWrapper>
  )
}

export default Categories
