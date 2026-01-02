import { BUDGET_KEY } from "@/globals/globals"
import { getBudget } from "@/utils/budgetStorage"
import { createContext, useContext, useEffect, useState } from "react"

export type BudgetType = {
  category: string,
  amount: string
}

type BudgetContextType = {
  budgetInfo: BudgetType[]
  refreshBudgetInfo: () => void
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
  const [budgetInfo, setBudgetInfo] = useState<BudgetType[]>([])

  const refreshBudgetInfo = () => {
    const budgetData = getBudget({key: BUDGET_KEY})

    setBudgetInfo(budgetData)
  }

  useEffect(() => {
    refreshBudgetInfo()
  }, [])

  return (
    <BudgetContext.Provider value={{
      budgetInfo,
      refreshBudgetInfo,
    }}>
      {props.children}
    </BudgetContext.Provider>
  )
}