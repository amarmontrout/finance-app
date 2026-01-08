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
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material"

const Budget = () => {
  const { 
    budgetCategories, 
    refreshBudgetCategories,
    budgetEntries,
    refreshBudgetEntries
  } = useBudgetContext()
  const { start, end, prevStart, prevEnd } = getWeekBounds()
  const { theme: currentTheme } = useTheme()

  const [week, setWeek] = useState<"prev" | "current">("current")
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
    return budgetEntries.filter(entry => {
      if (week === "prev") {
        return entry.createdAt >= prevStart && entry.createdAt <= prevEnd
      }
      
      return entry.createdAt >= start && entry.createdAt <= end
    })
  }, [budgetEntries, start, end, prevStart, prevEnd, week])

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
  }, [budgetCategories, weeklyEntries])

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
        budgetCategories={budgetCategories}
        refreshBudgetCategories={refreshBudgetCategories}
        budgetEntries={weeklyEntries}
        refreshBudgetEntries={refreshBudgetEntries}
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
        budgetCategories={budgetCategories}
        selectedEntry={selectedEntry}
        refreshBudgetEntries={refreshBudgetEntries}
      />
    </FlexColWrapper>
  )
}

export default Budget