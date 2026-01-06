"use client"

import { FlexColWrapper } from "@/components/Wrappers"
import { 
  BudgetCategoryType, 
  BudgetEntryType, 
  useBudgetContext 
} from "@/contexts/budget-context"
import { useEffect, useMemo, useState } from "react"
import RemainingBudget from "./RemainingBudget"
import BudgetEntries from "./BudgetEntries"
import { 
  cleanNumber, 
  formattedStringNumber,
  getWeekBounds
} from "@/utils/helperFunctions"
import EditBudgetEntryDialog from "./EditBudgetEntryDialog"
import { useTheme } from "next-themes"

const Budget = () => {
  const { 
    budgetCategories, 
    refreshBudgetCategories,
    budgetEntries,
    refreshBudgetEntries
  } = useBudgetContext()
  const { start, end } = getWeekBounds()
  const { theme: currentTheme } = useTheme()

  const [notes, setNotes] = useState<string[]>([])
  const [selectedEntry, setSelectedEntry] = 
    useState<BudgetEntryType | null>(null)
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)

  useEffect(() => {
    refreshBudgetEntries()
    refreshBudgetCategories()
  }, [])

  useEffect(() => {
    let notes: string[] = []
    budgetEntries.map((entry) => {
      if (!notes.includes(entry.note)) {
        notes.push(entry.note)
      }
    })
    setNotes(notes)
  }, [budgetEntries])

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
        currentTheme={currentTheme}
      />

      <BudgetEntries
        budgetCategories={budgetCategories}
        refreshBudgetCategories={refreshBudgetCategories}
        budgetEntries={weeklyEntries}
        refreshBudgetEntries={refreshBudgetEntries}
        notes={notes}
        setOpenEditDialog={setOpenEditDialog}
        setSelectedEntry={setSelectedEntry}
        currentTheme={currentTheme}
      />

      <EditBudgetEntryDialog
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        notes={notes}
        budgetCategories={budgetCategories}
        selectedEntry={selectedEntry}
        refreshBudgetEntries={refreshBudgetEntries}
      />
    </FlexColWrapper>
  )
}

export default Budget