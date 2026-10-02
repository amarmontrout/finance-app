import { TransactionTypeValue } from "../transactions/models"

export type CategoryType = {
  category_id: string
  parent_id: string | null
  name: string
  default_transaction_type: TransactionTypeValue
  default_account_id: string | null
  color: string | null
  deleted_at: string | null
}

export type CreateCategoryType = {
  name: string
  default_transaction_type: TransactionTypeValue
  default_account_id: string | null
  color: string | null
}
