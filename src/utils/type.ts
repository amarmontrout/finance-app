export type HookSetter<T> = React.Dispatch<React.SetStateAction<T>>

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
  isReturn: boolean,
  date: DateType
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

export type DateType = {
  month: string,
  day: number | undefined, 
  year: number
}

export type SelectedTransactionType = { 
  id: number,
  type: "income" | "expenses" 
}