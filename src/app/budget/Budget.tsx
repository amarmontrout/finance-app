"use client"

import { FlexColWrapper } from "@/components/Wrappers"
import { useBudgetContext } from "@/contexts/budget-context"
import { useEffect } from "react"
import SetBudget from "./SetBudget"
import RemainingBudget from "./RemainingBudget"
import BudgetEntries from "./BudgetEntries"

const Budget = () => {
  const { budgetCategories, refreshBudgetCategories } = useBudgetContext()

  useEffect(() => {
    refreshBudgetCategories()
  }, [])

  return (
    <FlexColWrapper gap={2}>
      <SetBudget
        budgetCategories={budgetCategories}
      />

      <RemainingBudget
        budgetCategories={budgetCategories}
      />

      <BudgetEntries/>
    </FlexColWrapper>
  )
}

export default Budget