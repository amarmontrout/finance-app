export type AccountTypeValue = "Checking" | "Savings" | "Credit Card"

export type TransactionTypeValue = "Income" | "Expense" | "Refund" | "Return"

// ACCOUNT =====================================================================
export type V2AccountType = {
  account_id: string
  name: string
  type: AccountTypeValue
  deleted_at: string | null
}

export type V2CreateAccountType = {
  name: string
  type: AccountTypeValue
}

// BUDGET ======================================================================
export type V2BudgetType = {
  budget_id: string
  category_id: string
  start_date: string
  end_date: string | null
  amount: number
  deleted_at: string | null
}

export type V2CreateBudgetType = {
  category_id: string
  start_date: string
  amount: number
}

export type V2HydratedBudgetType = {
  budget_id: string
  category_id: string
  category_name: string
  start_date: string
  end_date: string | null
  amount: number
  deleted_at: string | null
}

// CATEGORY ====================================================================
export type V2CategoryType = {
  category_id: string
  parent_id: string | null
  name: string
  default_transaction_type: TransactionTypeValue
  default_account_id: string | null
  color: string | null
  deleted_at: string | null
}

export type V2CreateCategoryType = {
  name: string
  default_transaction_type: TransactionTypeValue
  default_account_id: string | null
  color: string | null
}

// MERCHANT ====================================================================
export type V2MerchantType = {
  merchant_id: string
  default_category_id: string | null
  name: string
  deleted_at: string | null
}

export type V2CreateMerchantType = {
  default_category_id?: string | null
  name: string
}

// TRANSACTIONS ================================================================
export type V2TransactionType = {
  transaction_id: string
  account_id: string | null
  category_id: string | null
  merchant_id: string | null
  parent_transaction_id: string | null
  amount: number
  transaction_type: TransactionTypeValue
  description: string | null
  notes: string | null
  transaction_date: string
  is_paid: boolean | null
  created_at: string
  deleted_at: string | null
}

export type V2CreateTransactionType = {
  account_id: string | null
  category_id: string | null
  merchant_id: string | null
  parent_transaction_id?: string | null
  amount: number
  transaction_type: TransactionTypeValue
  description?: string
  notes?: string | null
  transaction_date: string
  is_paid: boolean | null
}

export type V2HydratedTransactionType = {
  transaction_id: string
  account_name: string
  account_type: string
  category_name: string
  category_color: string | null
  merchant_name: string
  amount: number
  transaction_type: TransactionTypeValue
  description: string | null
  notes: string | null
  transaction_date: string
  is_paid: boolean | null
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
