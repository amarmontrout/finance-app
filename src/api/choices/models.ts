export type BudgetType = {
  id: number,
  category: string,
  amount: number
}

export type ChoiceType = {
  id: number,
  name: string
  isExcluded?: boolean
  isRecurring?: boolean
}