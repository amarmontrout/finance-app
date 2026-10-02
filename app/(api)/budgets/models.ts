export type BudgetType = {
  budget_id: string
  category_id: string
  category: { name: string }
  start_month: string
  end_month: string | null
  amount: number
  deleted_at: string | null
}

export type CreateBudgetType = {
  category_id: string | null
  start_month: string
  amount: number
}
