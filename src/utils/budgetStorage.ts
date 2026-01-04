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
  updatedCategories
}: {
  key: string
  budgetCategory?: BudgetCategoryType
  updatedCategories?: BudgetCategoryType[]
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

  if (updatedCategories) {
    budgetData = updatedCategories
  }

  localStorage.setItem(key, JSON.stringify(budgetData))
  console.log("Budget category saved")
}

export const saveBudgetEntries = ({
  key,
  budgetEntry,
  updatedEntry
}: {
  key: string
  budgetEntry?: BudgetEntryType
  updatedEntry?: BudgetEntryType[]
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

  if (updatedEntry) {
    budgetData = updatedEntry
  }

  localStorage.setItem(key, JSON.stringify(budgetData))
  console.log("Budget entry saved")
}

export const updateBudgetCategories = (
  key: string,
  updatedCategory: BudgetCategoryType
) => {
  const categories = getBudgetCategories({ key })

  const updated = categories.map((c) =>
    c.category === updatedCategory.category ? updatedCategory : c
  )

  saveBudgetCategories({ key, updatedCategories: updated })
}

export const updateBudgetEntries = (
  key: string,
  updatedEntry: BudgetEntryType
) => {
  const entries = getBudgetEntries({ key })

  const updated = entries.map((c) =>
    c.createdAt === updatedEntry.createdAt ? updatedEntry : c
  )

  saveBudgetEntries({ key, updatedEntry: updated })
}