import { BUDGET_CATEGORIES_KEY, BUDGET_KEY } from "@/globals/globals"
import { getBudgetCategories, getBudgetEntries } from "@/utils/budgetStorage"
import { createContext, useContext, useEffect, useState } from "react"

export type BudgetCategoryType = {
  category: string,
  amount: string
}

export type BudgetEntryType = {
  category: string,
  note: string,
  amount: string
}

type BudgetContextType = {
  budgetCategories: BudgetCategoryType[]
  refreshBudgetCategories: () => void
  budgetEntries: BudgetEntryType[]
  refreshBudgetEntries: () => void
}

const BudgetContext = createContext<BudgetContextType | null>(null)

export const useBudgetContext = () => {
  const context = useContext(BudgetContext)

  if (!context) {
    throw new Error("useBudgetContext must be used within a BudgetProvider")
  }

  return context
}

export const BudgetProvider = (props: {
  children: React.ReactNode
}) => {
  const [budgetCategories, setBudgetCategories] = 
    useState<BudgetCategoryType[]>([])
  const [budgetEntries, setBudgetEntries] = 
    useState<BudgetEntryType[]>([])  

  const refreshBudgetCategories = () => {
    const budgetData = getBudgetCategories({key: BUDGET_CATEGORIES_KEY})
    setBudgetCategories(budgetData)
  }

  const refreshBudgetEntries = () => {
    const budgetData = getBudgetEntries({key: BUDGET_KEY})
    setBudgetEntries(budgetData)
  } 

  useEffect(() => {
    refreshBudgetCategories()
    refreshBudgetEntries()
  }, [])

  return (
    <BudgetContext.Provider value={{
      budgetCategories,
      refreshBudgetCategories,
      budgetEntries,
      refreshBudgetEntries
    }}>
      {props.children}
    </BudgetContext.Provider>
  )
}