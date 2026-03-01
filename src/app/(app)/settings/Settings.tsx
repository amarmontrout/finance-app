"use client"

import { Box, Typography } from "@mui/material"
import { useState } from "react"
import { useTheme } from "next-themes"
import { useCategoryContext } from "@/contexts/categories-context"
import EditCategorySettingsDialog from "@/app/(app)/settings/EditCategorySettingsDialog"
import AddYear from "./AddYear"
import AddIncomeCategory from "./AddIncomeCategory"
import AddExpenseCategory from "./AddExpenseCategory"
import AddBudget from "./AddBudget"
import EditBudgetDialog from "./EditBudgetDialog"
import { BudgetTypeV2, ChoiceTypeV2 } from "@/utils/type"
import { accentColorPrimarySelected } from "@/globals/colors"

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
    <Box className="flex flex-col gap-5 h-full">
      <Typography variant={"h5"} width={"100%"} textAlign={"center"}>
        Settings
      </Typography>

      <hr
        style={{
          border: `1px solid ${accentColorPrimarySelected}`,
        }}
      />

      <Box className="flex flex-col xl:flex-row gap-5 h-full">
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
