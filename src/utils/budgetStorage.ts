import { BudgetType } from "@/contexts/budget-context"


export const getBudget = ({
  key,
}: {
  key: string
}): BudgetType[] => {
  const stored = localStorage.getItem(key)
  if (!stored) return []

  try {
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is BudgetType =>
        typeof item?.category === "string" &&
        typeof item?.amount === "string"
    )
  } catch {
    return []
  }
}

export const saveBudget = ({
  key,
  budget,
}: {
  key: string
  budget: BudgetType
}) => {

  let budgetData: BudgetType[] = getBudget({ key })

  if (
    budget &&
    !budgetData.some((c) => c.category === budget.category)
  ) {
    budgetData.push({
      category: budget.category,
      amount: budget.amount
    })
  }

  localStorage.setItem(key, JSON.stringify(budgetData))
  console.log("Budget saved")
}
