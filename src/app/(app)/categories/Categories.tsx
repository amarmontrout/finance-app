"use client"

import DateSelector from "@/components/DateSelector"
import { useTransactionContext } from "@/contexts/transactions-context"
import {
  getAnnualCategoryTotalsV2,
  getMonthCategoryTotalsV2,
} from "@/utils/getTotals"
import { getCardColor, getCurrentDateInfo } from "@/utils/helperFunctions"
import { useTheme } from "next-themes"
import { useEffect, useMemo, useState } from "react"
import MonthlyCategoryBreakdown from "./MonthlyCategoryBreakdown"
import AnnualCategoryBreakdown from "./AnnualCategoryBreakdown"
import { FlexColWrapper } from "@/components/Wrappers"
import { useCategoryContext } from "@/contexts/categories-context"

const Categories = () => {
  const {
    incomeTransactionsV2,
    refreshIncomeTransactionsV2,
    expenseTransactionsV2,
    refreshExpenseTransactionsV2,
  } = useTransactionContext()
  const { yearsV2 } = useCategoryContext()
  const { theme: currentTheme } = useTheme()
  const { currentYear, currentMonth } = getCurrentDateInfo()

  const defaultCardColor = getCardColor(currentTheme, "default")

  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth)
  const [view, setView] = useState<"annual" | "month">("month")

  useEffect(() => {
    refreshIncomeTransactionsV2()
    refreshExpenseTransactionsV2()
  }, [selectedYear])

  const annualIncomeCategoryTotals = useMemo(
    () => getAnnualCategoryTotalsV2(selectedYear, incomeTransactionsV2),
    [incomeTransactionsV2, selectedYear],
  )
  const annualExpenseCategoryTotals = useMemo(
    () => getAnnualCategoryTotalsV2(selectedYear, expenseTransactionsV2),
    [expenseTransactionsV2, selectedYear],
  )

  const monthIncomeCategoryTotals = useMemo(
    () =>
      getMonthCategoryTotalsV2(
        selectedYear,
        selectedMonth,
        incomeTransactionsV2,
      ),
    [selectedYear, selectedMonth, incomeTransactionsV2],
  )
  const monthExpenseCategoryTotals = useMemo(
    () =>
      getMonthCategoryTotalsV2(
        selectedYear,
        selectedMonth,
        expenseTransactionsV2,
      ),
    [selectedYear, selectedMonth, expenseTransactionsV2],
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

  return (
    <FlexColWrapper gap={2}>
      <DateSelector
        view={view}
        setView={setView}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        years={yearsV2}
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
          topThreeExpenses={topThreeExpenses}
          defaultCardColor={defaultCardColor}
        />
      )}
    </FlexColWrapper>
  )
}

export default Categories
