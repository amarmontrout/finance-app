import { BudgetCategoryType, BudgetEntryType } from "@/contexts/budget-context"


export const getBudgetCategories = ({
  key,
}: {
  key: string
}): BudgetCategoryType[] => {
  const stored = localStorage.getItem(key)
  if (!stored) return []

  try {
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is BudgetCategoryType =>
        typeof item?.category === "string" &&
        typeof item?.amount === "string"
    )
  } catch {
    return []
  }
}

export const getBudgetEntries = ({
  key,
}: {
  key: string
}): BudgetEntryType[] => {
  const stored = localStorage.getItem(key)
  if (!stored) return []

  try {
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is BudgetEntryType =>
        typeof item?.category === "string" &&
        typeof item?.note === "string" &&
        typeof item?.amount === "string"
    )
  } catch {
    return []
  }
}

export const saveBudgetCategories = ({
  key,
  budgetCategory,
}: {
  key: string
  budgetCategory: BudgetCategoryType
}) => {

  let budgetData: BudgetCategoryType[] = getBudgetCategories({ key })

  if (
    budgetCategory &&
    !budgetData.some((c) => c.category === budgetCategory.category)
  ) {
    budgetData.push({
      category: budgetCategory.category,
      amount: budgetCategory.amount
    })
  }

  localStorage.setItem(key, JSON.stringify(budgetData))
  console.log("Budget category saved")
}

export const saveBudgetEntries = ({
  key,
  budgetEntry,
}: {
  key: string
  budgetEntry: BudgetEntryType
}) => {

  let budgetData: BudgetEntryType[] = getBudgetEntries({ key })

  if (
    budgetEntry
  ) {
    budgetData.push({
      category: budgetEntry.category,
      note: budgetEntry.note,
      amount: budgetEntry.amount,
      createdAt: budgetEntry.createdAt
    })
  }

  localStorage.setItem(key, JSON.stringify(budgetData))
  console.log("Budget entry saved")
}