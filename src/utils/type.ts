export type TransactionTypeV2 = {
  id: number,
  month: string,
  year: number,
  category: string,
  amount: number
}

export type BudgetTransactionTypeV2 = {
  id: number,
  category: string,
  note: string,
  amount: number,
  createdAt: number
}

export type BudgetTypeV2 = {
  id: number,
  category: string,
  amount: number
}

export type ChoiceTypeV2 = {
  id: number,
  name: string
  isExcluded?: boolean
  isRecurring?: boolean
}