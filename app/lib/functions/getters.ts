import { AccountType } from "@/app/(api)/accounts/models"
import { TransactionType } from "@/app/(api)/transactions/models"

/** Returns today's date in ISO format. YYYY-MM-DD */
export const getISODate = (date: Date = new Date()) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`
}

/**
 * Takes in a Date or ISO date string and returns and ISO string of the current
 * year and month, setting the day to 01.
 */
export const getISOMonth = (date: Date | string = new Date()): string => {
  if (typeof date === "string") {
    const [year, month] = date.split("-")
    return `${year}-${month}-01`
  }
  return getISODate(new Date(date.getFullYear(), date.getMonth(), 1))
}

/**
 * Takes in a ISO or Date and a months number (-1: prev month, 1: next month...)
 * Returns the ISO date string of the year, month, and setting the day to 01.
 */
export const getISOMonthWithOffset = (date: Date | string, offset: number) => {
  const [year, month] =
    typeof date === "string"
      ? date.split("-").map(Number)
      : [date.getFullYear(), date.getMonth() + 1]

  return getISOMonth(new Date(year, month - 1 + offset, 1))
}

/**
 * Get start and end dates in ISO format for the provided Date
 */
export const getDateRange = (date: Date | string = new Date()) => {
  const [year, month] =
    typeof date === "string"
      ? date.split("-").map(Number)
      : [date.getFullYear(), date.getMonth() + 1]

  return {
    startOfMonth: getISOMonth(date),
    endOfMonth: getISODate(new Date(year, month, 0)),
  }
}

export const getTotalIncomeAndExpense = ({
  transactions,
  accountMap,
}: {
  transactions: TransactionType[]
  accountMap: Map<string, AccountType>
}) => {
  const totals = transactions.reduce(
    (totals, transaction) => {
      if (transaction.transaction_type === "Income") {
        totals.totalIncome += transaction.amount
      }
      if (
        transaction.transaction_type === "Expense" &&
        accountMap.get(transaction.account_id!)?.type === "Checking" &&
        transaction.is_paid
      ) {
        totals.totalExpense += transaction.amount
      }
      return totals
    },
    { totalIncome: 0, totalExpense: 0 },
  )
  return {
    ...totals,
    netIncome: totals.totalIncome - totals.totalExpense,
  }
}

/**
 * Returns how many days in the provided month
 */
export const getDaysInMonth = (isoDate: string) => {
  const [year, month] = isoDate.split("-").map(Number)
  return new Date(year, month, 0).getDate()
}

/**
 * Calculate remaining budget for the month and remaining daily allowance
 */
export const getBudgetInfo = ({
  budget,
  spent,
  date,
}: {
  budget: number
  spent: number
  date: string // YYYY-MM-DD
}) => {
  const [, , day] = date.split("-").map(Number)

  const daysInMonth = getDaysInMonth(date)
  const remainingDays = daysInMonth - day
  const remainingBudget = budget - spent

  const budgetPerDay = budget / daysInMonth
  const earnedBudget = budgetPerDay * day
  const budgetLeftToEarn = budgetPerDay * remainingDays

  return {
    remainingDays,
    remainingBudget,
    earnedBudget,
    budgetLeftToEarn,
    budgetPerDay,
  }
}
