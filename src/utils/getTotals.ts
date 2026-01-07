import { FlatTransaction } from "@/contexts/transactions-context"
import { formattedStringNumber } from "./helperFunctions"
import { TransactionData } from "./transactionStorage"

export const getYearTotal = (
  year: string, 
  transactions: TransactionData,
  excludedCategories: Set<string>
): string => {
  let total = 0
  if (transactions[year]) {
    Object.entries(transactions[year]).map(([month, _]) => {
      transactions[year][month].map((detail) => {
        if (!excludedCategories.has(detail.category)) {
          total += Number(detail.amount)
        }
      })
    })    
  }
  return formattedStringNumber(total)
}

export const getMonthTotal = (
  year: string, 
  month: string, 
  transactions: TransactionData,
  excludedCategories: Set<string>
): string => {
  let total = 0
  if (transactions[year] && transactions[year][month]) {
    transactions[year][month].map((detail) => {
      if (!excludedCategories.has(detail.category)) {
        total += Number(detail.amount)
      }
    })
  }
  return formattedStringNumber(total)
}

export const getAnnualCategoryTotals = (
  year: string,
  transactions: FlatTransaction[]
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

export const getMonthCategoryTotals = (
  year: string, 
  month: string, 
  transactions: FlatTransaction[]
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