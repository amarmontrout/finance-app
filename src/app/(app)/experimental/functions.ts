import { formattedStringNumber } from "@/utils/helperFunctions"
import { NewTransactionType } from "@/utils/type"

/**
 * Gets total income and total expenses for a provided year. Intended to be used
 * to calculate net cash flow.
 * 
 * NOTE: Ignores Credit payments. The expense total is based on the Debit 
 * payment method. These expenses are considered to actually have been paid.
 */
export const getTotalsForYearNetCash = (
  year: number,
  transactions: NewTransactionType[],
  excludedCategories: Set<string>
): {incomeTotalYear: number, expenseTotalYear: number} => {
  let incomeTotalYear = 0
  let expenseTotalYear = 0

  transactions.forEach((entry) => {
    if (entry.date.year === year) {
      if (!excludedCategories.has(entry.category)) {
        if (entry.type == "income") {
          incomeTotalYear += entry.amount
        } 
        
        if (entry.type == "expense" && entry.payment_method === "Debit") {
          expenseTotalYear += entry.amount
        }
      }
    }
  })

  return {incomeTotalYear, expenseTotalYear}
}

/**
 * Gets total income and total expenses for a provided year regardless of 
 * payment method.
 */
export const getTotalsForYear = (
  year: number,
  transactions: NewTransactionType[],
  excludedCategories: Set<string>
): {incomeTotalYear: number, expenseTotalYear: number} => {
  let incomeTotalYear = 0
  let expenseTotalYear = 0

  transactions.forEach((entry) => {
    if (entry.date.year === year) {
      if (!excludedCategories.has(entry.category)) {
        if (entry.type == "income") {
          incomeTotalYear += entry.amount
        } 
        
        if (entry.type == "expense") {
          expenseTotalYear += entry.amount
        }
      }
    }
  })

  return {incomeTotalYear, expenseTotalYear}
}

/**
 * Gets total income and total expenses for a provided month and year. Intended 
 * to be used to calculate net cash flow.
 * 
 * NOTE: Ignores Credit payments. The expense total is based on the Debit 
 * payment method. These expenses are considered to actually have been paid.
 */
export const getTotalsForMonthNetCash = (
  year: number, 
  month: string, 
  transactions: NewTransactionType[],
  excludedCategories: Set<string>
): {incomeTotalMonth: number, expenseTotalMonth: number} => {
  let incomeTotalMonth = 0
  let expenseTotalMonth = 0

  transactions.forEach((entry) => {
    if (entry.date.year === year && entry.date.month == month) {
      if (!excludedCategories.has(entry.category)) {
        if (entry.type == "income") {
          incomeTotalMonth += entry.amount
        } 
        
        if (entry.type == "expense" && entry.payment_method === "Debit") {
          expenseTotalMonth += entry.amount
        }
      }
    }
  })

  return {incomeTotalMonth, expenseTotalMonth}
}

/**
 * Gets total income and total expenses for a provided month and year. 
 * Regardless of payment method.
 */
export const getTotalsForMonth = (
  year: number, 
  month: string, 
  transactions: NewTransactionType[],
  excludedCategories: Set<string>
): {incomeTotalMonth: number, expenseTotalMonth: number} => {
  let incomeTotalMonth = 0
  let expenseTotalMonth = 0

  transactions.forEach((entry) => {
    if (entry.date.year === year && entry.date.month == month) {
      if (!excludedCategories.has(entry.category)) {
        if (entry.type == "income") {
          incomeTotalMonth += entry.amount
        } 
        
        if (entry.type == "expense") {
          expenseTotalMonth += entry.amount
        }
      }
    }
  })

  return {incomeTotalMonth, expenseTotalMonth}
}

/**
 * Gets total income and total expenses YTD. Intended to be used to calculate 
 * net cash flow.
 * 
 * NOTE: Ignores Credit payments. The expense total is based on the Debit 
 * payment method. These expenses are considered to actually have been paid.
 */
export const getTotalsYTDNetCash = (
  year: number, 
  passedMonths: string[],
  transactions: NewTransactionType[],
  excludedCategories: Set<string>
): {incomeTotalYTD: number, expenseTotalYTD: number} => {
  let incomeTotalYTD = 0
  let expenseTotalYTD = 0

  transactions.forEach((entry) => {
    if (entry.date.year === year && passedMonths.includes(entry.date.month)) {
      if (!excludedCategories.has(entry.category)) {
        if (entry.type == "income") {
          incomeTotalYTD += entry.amount
        } 
        
        if (entry.type == "expense" && entry.payment_method === "Debit") {
          expenseTotalYTD += entry.amount
        }
      }
    }
  })

  return {incomeTotalYTD, expenseTotalYTD}
}

/**
 * Gets total income and total expenses YTD. Regardless of payment method.
 */
export const getTotalsYTD = (
  year: number, 
  passedMonths: string[],
  transactions: NewTransactionType[],
  excludedCategories: Set<string>
): {incomeTotalYTD: number, expenseTotalYTD: number} => {
  let incomeTotalYTD = 0
  let expenseTotalYTD = 0

  transactions.forEach((entry) => {
    if (entry.date.year === year && passedMonths.includes(entry.date.month)) {
      if (!excludedCategories.has(entry.category)) {
        if (entry.type == "income") {
          incomeTotalYTD += entry.amount
        } 
        
        if (entry.type == "expense") {
          expenseTotalYTD += entry.amount
        }
      }
    }
  })

  return {incomeTotalYTD, expenseTotalYTD}
}

/**
 * Calculates net total and returns a formatted currency string.
 */
export const getNetCashString = (
  incomeTotal: number, 
  expenseTotal: number
): string => {
  return `$${formattedStringNumber(incomeTotal-expenseTotal)}`
}

/**
 * Calculates savings rate percentage and returns a formatted percentage string.
 */
export const getSavingRateString = (
  incomeTotal: number, 
  expenseTotal: number
): string => {
  if (incomeTotal === 0) return `${0}%`
  const rate = (incomeTotal - expenseTotal)/incomeTotal * 100
  return `${rate.toFixed(1)}%`
}

/**
 * Predicts the annual total and returns a formatted currency string.
 */
export const getAnnualProjectionTotalString = (
  ytdTotal: number, 
  ytdMonths: number
): string | null => {
  if (ytdMonths === 0) return null
  
  return `$${(ytdTotal / ytdMonths) * 12}`
}

/**
 * Returns the avergage of an array of numbers.
 */
export const getAverageNumber = (
  ytdAmounts: number[],
): number => {
  if (ytdAmounts.length === 0) return 0
  
  const total = ytdAmounts.reduce(
    (sum, amount) => sum + amount,
    0
  )

  const average = total/ytdAmounts.length

  return average
}