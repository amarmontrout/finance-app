import { TransactionData } from "./saveTransaction"

export const getYearTotal = (year: string, transactions: TransactionData) => {
  let total = 0

  Object.entries(transactions[year]).map(([month, _]) => {
    transactions[year][month].map((detail) => {
      total = total + Number(detail.amount)
    })
  })

  return "$ " + total.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export const getMonthTotal = (year: string, month: string, transactions: TransactionData) => {
  let total = 0

  if (transactions[year]) {
    transactions[year][month].map((detail) => {
      if (detail.category !== "Water") {
        total = total + Number(detail.amount)
      }
    })
  }

  return "$ " + total.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}