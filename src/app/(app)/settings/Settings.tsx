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
import { BudgetType, ChoiceType } from "@/utils/type"
import { accentColorPrimarySelected } from "@/globals/colors"
import {
  saveBudgetCategory,
  saveExpenseCategory,
} from "@/app/api/Choices/requests"
import { makeId } from "@/utils/helperFunctions"

const Settings = () => {
  const {
    incomeCategories,
    expenseCategories,
    budgetCategories,
    years,
    loadCategories,
  } = useCategoryContext()
  const { theme: currentTheme } = useTheme()

  const [choice, setChoice] = useState<ChoiceType | null>(null)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState<boolean>(false)
  const [budgetEditDialogOpen, setBudgetEditDialogOpen] =
    useState<boolean>(false)
  const [confirmSelection, setConfirmSelection] = useState<BudgetType | null>(
    null,
  )
  const [confirmEdit, setConfirmEdit] = useState<BudgetType | null>(null)

  const syncExpenseToBudget = async (expenseName: string, userId: string) => {
    const exists = budgetCategories.some((b) => b.category === expenseName)

    if (!exists) {
      await saveBudgetCategory({
        userId: userId,
        body: {
          id: makeId(),
          category: expenseName,
          amount: 50,
        },
      })
      await loadCategories()
    }
  }

  const syncBudgetToExpense = async (
    budgetCategory: BudgetType,
    userId: string,
  ) => {
    const exists = expenseCategories.some(
      (c) => c.name === budgetCategory.category,
    )

    if (!exists) {
      await saveExpenseCategory({
        userId: userId,
        body: {
          id: makeId(),
          name: budgetCategory.category,
        },
      })
      await loadCategories()
    }
  }

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
        <AddYear years={years} loadCategories={loadCategories} />

        <AddIncomeCategory
          incomeCategories={incomeCategories}
          loadCategories={loadCategories}
        />

        <AddExpenseCategory
          setCategoryDialogOpen={setCategoryDialogOpen}
          setChoice={setChoice}
          expenseCategories={expenseCategories}
          loadCategories={loadCategories}
          syncExpenseToBudget={syncExpenseToBudget}
        />
      </Box>

      <Box className="flex flex-col xl:flex-row xl:w-[33%] gap-2 h-full">
        <AddBudget
          confirmSelection={confirmSelection}
          setConfirmSelection={setConfirmSelection}
          setBudgetEditDialogOpen={setBudgetEditDialogOpen}
          setConfirmEdit={setConfirmEdit}
          budgetCategories={budgetCategories}
          loadCategories={loadCategories}
          syncBudgetToExpense={syncBudgetToExpense}
        />
      </Box>

      <EditCategorySettingsDialog
        categoryDialogOpen={categoryDialogOpen}
        setCategoryDialogOpen={setCategoryDialogOpen}
        choice={choice}
        refresh={loadCategories}
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
