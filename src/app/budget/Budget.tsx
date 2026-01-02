"use client"

import { FlexColWrapper } from "@/components/Wrappers"
import { BudgetCategoryType, useBudgetContext } from "@/contexts/budget-context"
import { useEffect, useMemo } from "react"
import RemainingBudget from "./RemainingBudget"
import BudgetEntries from "./BudgetEntries"
import { 
  cleanNumber, 
  formattedStringNumber,
  getWeekBounds
} from "@/utils/helperFunctions"

const Budget = () => {
  const { 
    budgetCategories, 
    refreshBudgetCategories,
    budgetEntries,
    refreshBudgetEntries
  } = useBudgetContext()
  const { start, end } = getWeekBounds()

  useEffect(() => {
    refreshBudgetEntries()
    refreshBudgetCategories()
  }, [])

  const weeklyEntries = useMemo(() => {
    return budgetEntries.filter(entry =>
      entry.createdAt >= start && entry.createdAt <= end
    )
  }, [budgetEntries, start, end])

  const remainingBudgetCategories = useMemo(() => {
    let remaining: BudgetCategoryType[] = []

    budgetCategories.map((category) => {
      let budget = cleanNumber(category.amount)
      let total = 0

      weeklyEntries.map((entry) => {
        if (entry.category === category.category) {
          total += cleanNumber(entry.amount)
        }
      })

      remaining.push({
        category: category.category, 
        amount: formattedStringNumber(budget-total)
      })
    })

    return remaining
  }, [budgetCategories, budgetEntries])

  return (
    <FlexColWrapper gap={2}>
      <RemainingBudget
        budgetCategories={remainingBudgetCategories}
      />

      <BudgetEntries
        budgetCategories={budgetCategories}
        refreshBudgetCategories={refreshBudgetCategories}
        budgetEntries={weeklyEntries}
        refreshBudgetEntries={refreshBudgetEntries}
      />
    </FlexColWrapper>
  )
}

export default Budget