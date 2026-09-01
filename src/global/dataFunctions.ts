import { TransactionType } from "@/api/transactions/models"
import { V2AccountType, V2TransactionType } from "@/api/v2/models"

export const getTransactionsByType = ({
  transactions,
  type,
  month,
  year,
}: {
  transactions: TransactionType[]
  type: "income" | "expense"
  month?: string
  year?: number
}) => {
  return transactions.filter((transaction) => {
    if (transaction.type !== type) return false
    if (month && transaction.date.month !== month) return false
    if (year && transaction.date.year !== year) return false

    return true
  })
}

export const getTransactionsByDate = ({
  transactions,
  month,
  year,
}: {
  transactions: TransactionType[]
  month?: string
  year?: number
}) => {
  return transactions.filter((transaction) => {
    if (month && transaction.date.month !== month) return false
    if (year && transaction.date.year !== year) return false

    return true
  })
}

export const getExpenseTransactionsByPaymentMethod = ({
  transactions,
  paymentMethod,
  month,
  year,
}: {
  transactions: TransactionType[]
  paymentMethod: "Debit" | "Credit"
  month?: string
  year?: number
}) => {
  return transactions.filter((transaction) => {
    if (transaction.payment_method !== paymentMethod) return false
    if (transaction.type !== "expense") return false
    if (month && transaction.date.month !== month) return false
    if (year && transaction.date.year !== year) return false
    return true
  })
}

export const getTransactionsTotalByCategory = ({
  transactions,
  category,
}: {
  transactions: TransactionType[]
  category: string
}) => {
  return transactions.reduce((total, transaction) => {
    if (transaction.category !== category) return total

    return (
      total + (transaction.is_return ? -transaction.amount : transaction.amount)
    )
  }, 0)
}

// V2TransactionType ===========================================================

export const getTransactionsTotal = ({
  transactions,
}: {
  transactions: V2TransactionType[]
}) => {
  return transactions
    .filter((transaction) =>
      transaction.transaction_type === "Income"
        ? transaction
        : transaction.is_paid,
    )
    .reduce((total, transaction) => total + transaction.amount, 0)
}

export const getIncomeTotal = (transactions: V2TransactionType[]) => {
  return transactions.reduce((total, transaction) => {
    if (transaction.transaction_type !== "Income") return total

    return total + transaction.amount
  }, 0)
}

export const getDebitExpenseTotal = (
  transactions: V2TransactionType[],
  accountMap: Map<string, V2AccountType>,
) => {
  return transactions.reduce((total, transaction) => {
    if (
      transaction.transaction_type !== "Expense" ||
      accountMap.get(transaction.account_id!)?.type !== "Checking" ||
      !transaction.is_paid
    )
      return total

    return total + transaction.amount
  }, 0)
}
