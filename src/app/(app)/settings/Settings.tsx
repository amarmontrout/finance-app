"use client"

import { Box } from "@mui/material"
import { useState } from "react"
import { useTheme } from "next-themes"
import { useCategoryContext } from "@/contexts/categories-context"
import EditCategorySettingsDialog from "@/components/EditCategorySettingsDialog"
import AddYear from "./AddYear"
import AddIncomeCategory from "./AddIncomeCategory"
import AddExpenseCategory from "./AddExpenseCategory"
import AddBudget from "./AddBudget"
import EditBudgetDialog from "./EditBudgetDialog"
import { BudgetTypeV2, ChoiceTypeV2 } from "@/utils/type"

const Settings = () => {
  const { refreshExpenseCategoryChoicesV2 } = useCategoryContext()
  const { theme: currentTheme } = useTheme()

  const [choice, setChoice] = useState<ChoiceTypeV2 | null>(null)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState<boolean>(false)
  const [budgetEditDialogOpen, setBudgetEditDialogOpen] =
    useState<boolean>(false)
  const [confirmSelection, setConfirmSelection] = useState<BudgetTypeV2 | null>(
    null,
  )
  const [confirmEdit, setConfirmEdit] = useState<BudgetTypeV2 | null>(null)

  return (
    <Box className="flex flex-col gap-2 h-full">
      <Box className="flex flex-col xl:flex-row gap-2 h-full">
        <AddYear />

        <AddIncomeCategory />

        <AddExpenseCategory
          setCategoryDialogOpen={setCategoryDialogOpen}
          setChoice={setChoice}
        />
      </Box>

      <Box className="flex flex-col xl:flex-row xl:w-[33%] gap-2 h-full">
        <AddBudget
          confirmSelection={confirmSelection}
          setConfirmSelection={setConfirmSelection}
          setBudgetEditDialogOpen={setBudgetEditDialogOpen}
          setConfirmEdit={setConfirmEdit}
        />
      </Box>

      <EditCategorySettingsDialog
        categoryDialogOpen={categoryDialogOpen}
        setCategoryDialogOpen={setCategoryDialogOpen}
        choice={choice}
        refresh={refreshExpenseCategoryChoicesV2}
      />

      <EditBudgetDialog
        budgetEditDialogOpen={budgetEditDialogOpen}
        setBudgetEditDialogOpen={setBudgetEditDialogOpen}
        confirmEdit={confirmEdit}
        currentTheme={currentTheme}
      />
    </Box>
  )
}

export default Settings
