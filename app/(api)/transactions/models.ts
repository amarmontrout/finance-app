// Removed Refund. May add it back or consider refunds as income.
export type TransactionTypeValue = "Income" | "Expense" | "Return"

export type TransactionType = {
  transaction_id: string
  account_id: string
  account: { name: string }
  category_id: string
  category: { name: string }
  merchant_id: string
  merchant: { name: string }
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

export type CreateTransactionType = {
  account_id: string
  category_id: string
  merchant_id: string
  parent_transaction_id?: string | null
  amount: number
  transaction_type: TransactionTypeValue
  description?: string | null
  notes?: string | null
  transaction_date: string
  is_paid: boolean | null
}
