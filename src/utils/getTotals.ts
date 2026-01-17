import { formattedStringNumber } from "./helperFunctions"
import { TransactionTypeV2 } from "./type"

export const getYearTotalV2 = (
  year: number, 
  transactions: TransactionTypeV2[],
  excludedCategories: Set<string>
): string => {
  let total = 0
  transactions.map((entry) => {
    if (entry.year === year) {
      if (!excludedCategories.has(entry.category)) {
        total += entry.amount
      }
    }
  })
  return formattedStringNumber(total)
}

export const getMonthTotalV2 = (
  year: number, 
  month: string, 
  transactions: TransactionTypeV2[],
  excludedCategories: Set<string>
): string => {
  let total = 0
  transactions.map((entry) => {
    if (entry.year === year && entry.month === month) {
      if (!excludedCategories.has(entry.category)) {
        total += entry.amount
      }
    }
  })
  return formattedStringNumber(total)
}

export const getAnnualCategoryTotalsV2 = (
  year: number,
  transactions: TransactionTypeV2[]
): [string, string | number][] => {
  const categoryTotals: Record<string, number> = {}
  if (!transactions) {
    return [["Category", "Total"]]
  }
  transactions.map((entry) => {
    if (entry.year === year) {
      categoryTotals[entry.category] = 
      (categoryTotals[entry.category] ?? 0) + Number(entry.amount)
    }
  })
  const pieChartData: [string, string | number][] = [["Category", "Total"]]
  Object.entries(categoryTotals).forEach(([category, total]) => {
    pieChartData.push([category, Number(total.toFixed(2))])
  })
  return pieChartData
}

export const getMonthCategoryTotalsV2 = (
  year: number, 
  month: string, 
  transactions: TransactionTypeV2[]
): [string, string | number][] => {
  const categoryTotals: Record<string, number> = {}
  if (!transactions) return [["Category", "Total"]]
  transactions.map((entry) => {
    if (entry.year === year && entry.month === month) {
      categoryTotals[entry.category] = 
      (categoryTotals[entry.category] ?? 0) + Number(entry.amount)
    }
  })
  const pieChartData: [string, string | number][] = [["Category", "Total"]]
  Object.entries(categoryTotals).forEach(([category, total]) => {
    pieChartData.push([category, Number(total.toFixed(2))])
  })
  return pieChartData
}