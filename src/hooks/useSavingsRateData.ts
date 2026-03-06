import { useMemo } from "react"
import { getMonthTotal, getYearTotal } from "@/utils/getTotals"
import { getSavingRate } from "@/utils/financialFunctions"
import { useCategoryContext } from "@/contexts/categories-context"
import { TransactionType } from "@/utils/type"

export const useSavingsRateData = (
  selectedYear: number,
  selectedMonth: string,
  incomeTransactions: TransactionType[],
  expenseTransactions: TransactionType[],
  prevMonthYear: number,
  prevMonth: string
) => {
  const { excludedSet } = useCategoryContext()
  const previousYear = selectedYear - 1

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
