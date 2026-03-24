"use client"

import { Box, Typography } from "@mui/material"
import { useState } from "react"
import { useCategoryContext } from "@/contexts/categories-context"
import EditCategorySettingsDialog from "@/app/(app)/settings/EditCategorySettingsDialog"
import AddYear from "./AddYear"
import AddIncomeCategory from "./AddIncomeCategory"
import AddExpenseCategory from "./AddExpenseCategory"
import { AlertToastType, BudgetType, ChoiceType } from "@/utils/type"
import { accentColorPrimarySelected } from "@/globals/colors"
import { saveBudgetCategory } from "@/app/api/Choices/requests"
import { makeId } from "@/utils/helperFunctions"
import AlertToast from "@/components/AlertToast"

const Settings = () => {
  const {
    incomeCategories,
    expenseCategories,
    budgetCategories,
    years,
    loadCategories,
  } = useCategoryContext()

  const [choice, setChoice] = useState<ChoiceType | null>(null)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState<boolean>(false)
  const [alertToast, setAlertToast] = useState<AlertToastType>()

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
        <AddYear
          years={years}
          loadCategories={loadCategories}
          setAlertToast={setAlertToast}
        />

        <AddIncomeCategory
          incomeCategories={incomeCategories}
          loadCategories={loadCategories}
          setAlertToast={setAlertToast}
        />

        <AddExpenseCategory
          setCategoryDialogOpen={setCategoryDialogOpen}
          setChoice={setChoice}
          expenseCategories={expenseCategories}
          loadCategories={loadCategories}
          syncExpenseToBudget={syncExpenseToBudget}
          setAlertToast={setAlertToast}
        />
      </Box>

      <EditCategorySettingsDialog
        categoryDialogOpen={categoryDialogOpen}
        setCategoryDialogOpen={setCategoryDialogOpen}
        choice={choice}
        refresh={loadCategories}
        setAlertToast={setAlertToast}
      />

      <AlertToast alertToast={alertToast} />
    </Box>
  )
}

export default Settings
