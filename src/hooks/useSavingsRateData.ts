import { useMemo } from "react"
import { getMonthTotalV2, getYearTotalV2 } from "@/utils/getTotals"
import { getSavingRate } from "@/utils/financialFunctions"
import { useCategoryContext } from "@/contexts/categories-context"
import { TransactionTypeV2 } from "@/utils/type"

export const useSavingsRateData = (
  selectedYear: number,
  selectedMonth: string,
  incomeTransactions: TransactionTypeV2[],
  expenseTransactions: TransactionTypeV2[],
  prevMonthYear: number,
  prevMonth: string
) => {
  const { excludedSet } = useCategoryContext()
  const previousYear = selectedYear - 1

  const monthIncome = useMemo(
    () => getMonthTotalV2(selectedYear, selectedMonth, incomeTransactions, excludedSet),
    [selectedYear, selectedMonth, incomeTransactions]
  )

  const monthExpense = useMemo(
    () => getMonthTotalV2(selectedYear, selectedMonth, expenseTransactions, excludedSet),
    [selectedYear, selectedMonth, expenseTransactions]
  )

  const prevMonthIncome = useMemo(
    () => getMonthTotalV2(prevMonthYear, prevMonth, incomeTransactions, excludedSet),
    [prevMonthYear, prevMonth, incomeTransactions]
  )

  const prevMonthExpense = useMemo(
    () => getMonthTotalV2(prevMonthYear, prevMonth, expenseTransactions, excludedSet),
    [prevMonthYear, prevMonth, expenseTransactions]
  )

  const annualIncome = useMemo(
    () => getYearTotalV2(selectedYear, incomeTransactions, excludedSet),
    [selectedYear, incomeTransactions]
  )

  const annualExpense = useMemo(
    () => getYearTotalV2(selectedYear, expenseTransactions, excludedSet),
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

  const monthRate = 
    getSavingRate(monthIncome, monthExpense)
  

  const prevMonthRate = 
    getSavingRate(prevMonthIncome, prevMonthExpense)
  

  const annualRate = 
    getSavingRate(annualIncome, annualExpense)
  

  const prevAnnualRate = 
    getSavingRate(prevAnnualIncome, prevAnnualExpense)
  
  
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
