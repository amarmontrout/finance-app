import { cleanNumber, formattedStringNumber } from "./helperFunctions"
import { TransactionData } from "./saveTransaction"

export const getYearTotal = (year: string, transactions: TransactionData) => {
  let total = 0

  if (transactions[year]) {
    Object.entries(transactions[year]).map(([month, _]) => {
      transactions[year][month].map((detail) => {
        if (detail.category !== "Water") {
          total = total + Number(detail.amount)
        }
      })
    })    
  }

  return formattedStringNumber(total)
}

export const getMonthTotal = (year: string, month: string, transactions: TransactionData) => {
  let total = 0

  if (transactions[year] && transactions[year][month]) {
    transactions[year][month].map((detail) => {
      if (detail.category !== "Water") {
        total = total + Number(detail.amount)
      }
    })
  }

  return formattedStringNumber(total)
}

export const getCategoryTotals = (
  year: string,
  transactions: TransactionData
): [string, string | number][] => {
  const categoryTotals: Record<string, number> = {}

  if (!transactions[year]) {
    return [["Category", "Total"]]
  }

  Object.values(transactions[year]).forEach((monthTransactions) => {
    monthTransactions.forEach(({ category, amount }) => {
      categoryTotals[category] =
        (categoryTotals[category] ?? 0) + Number(amount)
    })
  })

  const pieChartData: [string, string | number][] = [["Category", "Total"]]

  Object.entries(categoryTotals).forEach(([category, total]) => {
    pieChartData.push([category, Number(total.toFixed(2))])
  })

  return pieChartData
}