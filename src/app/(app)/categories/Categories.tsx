"use client"

import DateSelector from "@/components/DateSelector"
import MockDataWarning from "@/components/MockDataWarning"
import { useTransactionContext } from "@/contexts/transactions-context"
import { 
  getAnnualCategoryTotals, 
  getMonthCategoryTotals 
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
    flatIncomeTransactions,
    refreshIncomeTransactions,
    flatExpenseTransactions, 
    refreshExpenseTransactions,
  } = useTransactionContext()
  const { years } = useCategoryContext()
  const { theme: currentTheme } = useTheme()
  const { currentYear, currentMonth } = getCurrentDateInfo()

  const defaultCardColor = getCardColor(currentTheme, "default")

  const [selectedYear, setSelectedYear] = useState<string>(currentYear)
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth)
  const [view, setView] = useState<"annual" | "month">("month")

  useEffect(() => {
    refreshIncomeTransactions()
    refreshExpenseTransactions()
  }, [selectedYear])

  const annualIncomeCategoryTotals = useMemo(
    () => getAnnualCategoryTotals(
      selectedYear, 
      flatIncomeTransactions
    ),[flatIncomeTransactions, selectedYear]
  )
  const annualExpenseCategoryTotals = useMemo(
    () => getAnnualCategoryTotals(
      selectedYear, 
      flatExpenseTransactions
    ),[flatExpenseTransactions, selectedYear]
  )

  const monthIncomeCategoryTotals = useMemo(
    () => getMonthCategoryTotals(
      selectedYear, 
      selectedMonth, 
      flatIncomeTransactions
    ),[selectedYear, selectedMonth, flatIncomeTransactions]
  )
  const monthExpenseCategoryTotals = useMemo(
    () => getMonthCategoryTotals(
      selectedYear, 
      selectedMonth, 
      flatExpenseTransactions
    ),[selectedYear, selectedMonth, flatExpenseTransactions]
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
      <MockDataWarning/>

      <DateSelector
        view={view}
        setView={setView}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        years={years}
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