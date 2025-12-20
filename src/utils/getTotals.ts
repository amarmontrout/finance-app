import { cleanNumber } from "./helperFunctions"
import { TransactionData } from "./saveTransaction"

export const getYearTotal = (year: string, transactions: TransactionData) => {
  let total = 0

  Object.entries(transactions[year]).map(([month, _]) => {
    transactions[year][month].map((detail) => {
      total = total + Number(detail.amount)
    })
  })

  return total.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
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

  return total.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
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

export const getNetCashFlow = (income: string, expense: string) => {
  return (
    cleanNumber(income)-cleanNumber(expense)
  ).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
  })
}

export const getSavingRate = (income: string, expense: string) => {
  const cleanNumber = (str: string) => {
    return Number(str.replace(/[^0-9.-]+/g,""))
  }
  const incomeNumber = cleanNumber(income)
  const expenseNumber = cleanNumber(expense)
  if (incomeNumber === 0) return "0.00"
  const savingsRate = (incomeNumber - expenseNumber) / incomeNumber

  return (
    savingsRate * 100
  ).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
  })
}