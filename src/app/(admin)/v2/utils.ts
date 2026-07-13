import {
  V2AccountType,
  V2BudgetType,
  V2CategoryType,
  V2HydratedBudgetType,
  V2HydratedTransactionType,
  V2MerchantType,
  V2TransactionType,
} from "@/api/v2/models"

export const hydrateTransactions = ({
  accounts,
  categories,
  merchants,
  transactions,
}: {
  accounts: V2AccountType[]
  categories: V2CategoryType[]
  merchants: V2MerchantType[]
  transactions: V2TransactionType[]
}): V2HydratedTransactionType[] => {
  const accountMap = new Map(accounts.map((a) => [a.account_id, a]))
  const categoryMap = new Map(categories.map((c) => [c.category_id, c]))
  const merchantMap = new Map(merchants.map((m) => [m.merchant_id, m]))

  return transactions.map((transaction) => ({
    transaction_id: transaction.transaction_id,
    account_name: accountMap.get(transaction.account_id)?.name ?? "",
    account_type: accountMap.get(transaction.account_id)?.type ?? "",
    category_name: categoryMap.get(transaction.category_id)?.name ?? "",
    category_color: categoryMap.get(transaction.category_id)?.color ?? null,
    merchant_name: merchantMap.get(transaction.merchant_id)?.name ?? "",
    amount: transaction.amount,
    transaction_type: transaction.transaction_type,
    description: transaction.description,
    notes: transaction.notes,
    transaction_date: transaction.transaction_date,
    status: transaction.status,
    is_recurring: transaction.is_recurring,
    deleted_at: transaction.deleted_at,
  }))
}

export const hydrateBudgets = ({
  categories,
  budgets,
}: {
  categories: V2CategoryType[]
  budgets: V2BudgetType[]
}): V2HydratedBudgetType[] => {
  const categoryMap = new Map(categories.map((c) => [c.category_id, c]))

  return budgets.map((budget) => ({
    budget_id: budget.budget_id,
    category_id: budget.category_id,
    category_name: categoryMap.get(budget.category_id)?.name ?? "",
    start_date: budget.start_date,
    end_date: budget.end_date,
    amount: budget.amount,
    deleted_at: budget.deleted_at,
  }))
}

export const getToday = () => {
  const date = new Date()

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`
}
