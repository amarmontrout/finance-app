"use client"

import { FlexColWrapper } from "@/components/Wrappers"
import { useEffect, useMemo, useState } from "react"
import RemainingBudget from "./RemainingBudget"
import BudgetEntries from "./BudgetEntries"
import { getWeekBounds } from "@/utils/helperFunctions"
import EditBudgetEntryDialog from "./EditBudgetEntryDialog"
import { useTheme } from "next-themes"
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { useTransactionContext } from "@/contexts/transactions-context"
import { useCategoryContext } from "@/contexts/categories-context"
import { BudgetTransactionTypeV2, BudgetTypeV2 } from "@/utils/type"

const Budget = () => {
  const {
    budgetTransactionsV2,
    refreshBudgetTransactionsV2
  } = useTransactionContext()
  const { budgetCategoriesV2 } = useCategoryContext()

  const { start, end, prevStart, prevEnd } = getWeekBounds()
  const { theme: currentTheme } = useTheme()

  const [week, setWeek] = useState<"prev" | "current">("current")
  const [notes, setNotes] = useState<string[]>([])
  const [selectedEntry, setSelectedEntry] = 
    useState<BudgetTransactionTypeV2 | null>(null)
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)

  useEffect(() => {
    let notes: string[] = []
    budgetTransactionsV2.map((entry) => {
      if (!notes.includes(entry.note)) {
        notes.push(entry.note)
      }
    })
    setNotes(notes)
  }, [budgetTransactionsV2])

  const weeklyTransactions = useMemo(() => {
    return budgetTransactionsV2.filter(entry => {
      if (week === "prev") {
        return entry.createdAt >= prevStart && entry.createdAt <= prevEnd
      }
      
      return entry.createdAt >= start && entry.createdAt <= end
    })
  }, [budgetTransactionsV2, start, end, prevStart, prevEnd, week])

  const remainingBudgetCategories = useMemo(() => {
    let remaining: BudgetTypeV2[] = []

    budgetCategoriesV2.map((category) => {
      let budget = category.amount
      let total = 0

      weeklyTransactions.map((entry) => {
        if (entry.category === category.category) {
          total += entry.amount
        }
      })

      remaining.push({
        id: category.id,
        category: category.category, 
        amount: budget-total
      })
    })

    return remaining
  }, [budgetCategoriesV2, weeklyTransactions])

  return (
    <FlexColWrapper gap={2}>
      <Box
        className="flex flex-col sm:flex-row gap-3 h-full"
        paddingTop={"10px"}
      >
        <FormControl>
          <InputLabel>View</InputLabel>
          <Select
            className="w-full sm:w-[175px]"
            label="View"
            value={week}
            name={"view"}
            onChange={e => setWeek(e.target.value)}
          >
            <MenuItem key={"prev"} value={"prev"}>Previous Week</MenuItem>
            <MenuItem key={"current"} value={"current"}>Current Week</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <hr style={{width: "100%"}}/>

      <RemainingBudget
        budgetCategories={remainingBudgetCategories}
        currentTheme={currentTheme}
      />

      <BudgetEntries
        budgetCategories={budgetCategoriesV2}
        budgetTransactions={weeklyTransactions}
        refreshBudgetTransactions={refreshBudgetTransactionsV2}
        notes={notes}
        setOpenEditDialog={setOpenEditDialog}
        setSelectedEntry={setSelectedEntry}
        currentTheme={currentTheme}
        week={week}
      />

      <EditBudgetEntryDialog
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        notes={notes}
        budgetCategories={budgetCategoriesV2}
        selectedEntry={selectedEntry}
        refreshBudgetTransactions={refreshBudgetTransactionsV2}
      />
    </FlexColWrapper>
  )
}

export default Budget