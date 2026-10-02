export type AccountTypeValue = "Checking" | "Savings" | "Credit Card"

export type AccountType = {
  account_id: string
  name: string
  type: AccountTypeValue
  deleted_at: string | null
}

export type CreateAccountType = {
  name: string
  type: AccountTypeValue
}
