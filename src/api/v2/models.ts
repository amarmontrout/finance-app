export type AccountTypeValue = "checking" | "savings" | "credit_card"

export type TransactionTypeValue = "income" | "expense" | "refund"

// ACCOUNT =====================================================================
export type V2AccountType = {
  account_id: string
  user_id: string
  name: string
  type: AccountTypeValue
  deleted_at: string | null
}

// BUDGET ======================================================================
export type V2BudgetType = {
  budget_id: string
  user_id: string
  category_id: string
  start_date: string
  end_date: string | null
  amount: number
  deleted_at: string | null
}

// CATEGORY ====================================================================
export type V2CategoryType = {
  category_id: string
  user_id: string
  parent_id: string | null
  name: string
  default_transaction_type: TransactionTypeValue
  color: string | null
  deleted_at: string | null
}

// MERCHANT ====================================================================
export type V2MerchantType = {
  merchant_id: string
  user_id: string
  default_category_id: string | null
  name: string
  deleted_at: string | null
}

// TRANSACTIONS ================================================================
export type V2TransactionType = {
  transaction_id: string
  user_id: string
  account_id: string
  category_id: string | null
  merchant_id: string | null
  parent_transaction_id: string | null
  amount: number
  transaction_type: TransactionTypeValue
  description: string | null
  notes: string | null
  transaction_date: string
  status: string | null
  is_recurring: boolean
  created_at: string
  deleted_at: string | null
}

// ENUMS =======================================================================
export enum Schemas {
  V2 = "V2",
}

export enum Tables {
  Accounts = "accounts",
  Budgets = "budgets",
  Categories = "categories",
  Merchants = "merchants",
  Transactions = "transactions",
}

export enum IdColumns {
  Account = "account_id",
  Budget = "budget_id",
  Category = "category_id",
  Merchant = "merchant_id",
  Transaction = "transaction_id",
}
