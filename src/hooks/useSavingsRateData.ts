import { useMemo } from "react"
import { getMonthTotal, getYearTotal } from "@/utils/getTotals"
import { getSavingRate } from "@/utils/financialFunctions"
import { cleanNumber } from "@/utils/helperFunctions"
import { TransactionData } from "@/utils/transactionStorage"
import { useCategoryContext } from "@/contexts/categories-context"

export const useSavingsRateData = (
  selectedYear: string,
  selectedMonth: string,
  incomeTransactions: TransactionData,
  expenseTransactions: TransactionData,
  prevMonthYear: string,
  prevMonth: string
) => {
  const { excludedSet } = useCategoryContext()
  const previousYear = String(Number(selectedYear) - 1)

  const monthIncome = useMemo(
    () => getMonthTotal(selectedYear, selectedMonth, incomeTransactions, excludedSet),
    [selectedYear, selectedMonth, incomeTransactions]
  )

  const monthExpense = useMemo(
    () => getMonthTotal(selectedYear, selectedMonth, expenseTransactions, excludedSet),
    [selectedYear, selectedMonth, expenseTransactions]
  )

  const prevMonthIncome = useMemo(
    () => getMonthTotal(prevMonthYear, prevMonth, incomeTransactions, excludedSet),
    [prevMonthYear, prevMonth, incomeTransactions]
  )

  const prevMonthExpense = useMemo(
    () => getMonthTotal(prevMonthYear, prevMonth, expenseTransactions, excludedSet),
    [prevMonthYear, prevMonth, expenseTransactions]
  )

  const annualIncome = useMemo(
    () => getYearTotal(selectedYear, incomeTransactions, excludedSet),
    [selectedYear, incomeTransactions]
  )

  const annualExpense = useMemo(
    () => getYearTotal(selectedYear, expenseTransactions, excludedSet),
    [selectedYear, expenseTransactions]
  )

  const prevAnnualIncome = useMemo(
    () => getYearTotal(previousYear, incomeTransactions, excludedSet),
    [previousYear, incomeTransactions]
  )

  const prevAnnualExpense = useMemo(
    () => getYearTotal(previousYear, expenseTransactions, excludedSet),
    [previousYear, expenseTransactions]
  )

  const monthRate = cleanNumber(
    getSavingRate(monthIncome, monthExpense)
  )

  const prevMonthRate = cleanNumber(
    getSavingRate(prevMonthIncome, prevMonthExpense)
  )

  const annualRate = cleanNumber(
    getSavingRate(annualIncome, annualExpense)
  )

  const prevAnnualRate = cleanNumber(
    getSavingRate(prevAnnualIncome, prevAnnualExpense)
  )
  
  return {
    previousYear,
    monthRate,
    annualRate,
    diffs: {
      monthOverMonth: monthRate - prevMonthRate,
      monthVsAnnual: monthRate - annualRate,
      yearOverYear: annualRate - prevAnnualRate
    }
  }
}
