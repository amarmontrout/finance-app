import { useMemo } from "react"
import { getMonthTotalV2, getYearTotalV2 } from "@/utils/getTotals"
import { getSavingRate } from "@/utils/financialFunctions"
import { cleanNumber } from "@/utils/helperFunctions"
import { useCategoryContext } from "@/contexts/categories-context"
import { TransactionTypeV2 } from "@/utils/type"

export const useSavingsRateData = (
  selectedYear: string,
  selectedMonth: string,
  incomeTransactions: TransactionTypeV2[],
  expenseTransactions: TransactionTypeV2[],
  prevMonthYear: string,
  prevMonth: string
) => {
  const { excludedSet } = useCategoryContext()
  const previousYear = Number(selectedYear) - 1

  const monthIncome = useMemo(
    () => getMonthTotalV2(Number(selectedYear), selectedMonth, incomeTransactions, excludedSet),
    [selectedYear, selectedMonth, incomeTransactions]
  )

  const monthExpense = useMemo(
    () => getMonthTotalV2(Number(selectedYear), selectedMonth, expenseTransactions, excludedSet),
    [selectedYear, selectedMonth, expenseTransactions]
  )

  const prevMonthIncome = useMemo(
    () => getMonthTotalV2(Number(prevMonthYear), prevMonth, incomeTransactions, excludedSet),
    [prevMonthYear, prevMonth, incomeTransactions]
  )

  const prevMonthExpense = useMemo(
    () => getMonthTotalV2(Number(prevMonthYear), prevMonth, expenseTransactions, excludedSet),
    [prevMonthYear, prevMonth, expenseTransactions]
  )

  const annualIncome = useMemo(
    () => getYearTotalV2(Number(selectedYear), incomeTransactions, excludedSet),
    [selectedYear, incomeTransactions]
  )

  const annualExpense = useMemo(
    () => getYearTotalV2(Number(selectedYear), expenseTransactions, excludedSet),
    [selectedYear, expenseTransactions]
  )

  const prevAnnualIncome = useMemo(
    () => getYearTotalV2(previousYear, incomeTransactions, excludedSet),
    [previousYear, incomeTransactions]
  )

  const prevAnnualExpense = useMemo(
    () => getYearTotalV2(previousYear, expenseTransactions, excludedSet),
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
