"use client"

import { doLogout } from "@/api/auth/requests"
import { ChoiceType } from "@/api/choices/models"
import { saveBudgetCategory } from "@/api/choices/requests"
import { useCategoryContext } from "@/contexts/categories-context"
import { useTransactionContext } from "@/contexts/transaction-context"
import AlertToast from "@/global/components/AlertToast"
import {
  dateTypeToTimestamp,
  timestampToDateString,
} from "@/global/formattingFunctions"
import { getCurrentDateInfo, makeId } from "@/global/infoFunctions"
import { useUser } from "@/hooks/use-user"
import { AlertToastType } from "@/types/types"
import { Button, Stack, Typography } from "@mui/material"
import { AuthError } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useState } from "react"
import AddExpenseCategory from "./_components/AddExpenseCategory"
import AddIncomeCategory from "./_components/AddIncomeCategory"
import AddYear from "./_components/AddYear"
import EditCategorySettingsDialog from "./_components/EditCategorySettingsDialog"
import RecentlyDeleted from "./_components/RecentlyDeleted"

const Settings = () => {
  const {
    deletedTransactions,
    refreshDeletedTransactions,
    refreshTransactions,
  } = useTransactionContext()
  const {
    incomeCategories,
    expenseCategories,
    budgetCategories,
    years,
    loadCategories,
  } = useCategoryContext()
  const { today } = getCurrentDateInfo()
  const user = useUser()
  const router = useRouter()

  const [choice, setChoice] = useState<ChoiceType | null>(null)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState<boolean>(false)
  const [alertToast, setAlertToast] = useState<AlertToastType>()
  const [showV2, setShowV2] = useState<boolean>(false)

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

  const handleLogOut = () => {
    doLogout({
      router: router,
      errorHandler: (error: AuthError) => {
        console.error(error.message)
      },
    })
  }

  return (
    <Stack direction={"column"} spacing={3}>
      <Stack direction={"column"} alignItems={"center"}>
        <Typography variant={"caption"}>Welcome {user?.email}</Typography>

        <Typography fontWeight={"bold"}>
          {timestampToDateString(dateTypeToTimestamp(today))}
        </Typography>
      </Stack>

      <Button
        fullWidth
        color={"error"}
        variant={"contained"}
        onClick={handleLogOut}
      >
        Log out
      </Button>

      {/* <Button
        fullWidth
        color={"primary"}
        variant={"outlined"}
        onClick={() => {
          setShowV2(!showV2)
        }}
      >
        Toggle V2
      </Button> */}

      {!showV2 && (
        <Stack direction={"column"} spacing={1}>
          <RecentlyDeleted
            deletedTransactions={deletedTransactions}
            refreshDeletedTransactions={refreshDeletedTransactions}
            refreshTransactions={refreshTransactions}
            setAlertToast={setAlertToast}
          />

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
        </Stack>
      )}

      <EditCategorySettingsDialog
        categoryDialogOpen={categoryDialogOpen}
        setCategoryDialogOpen={setCategoryDialogOpen}
        choice={choice}
        refresh={loadCategories}
        setAlertToast={setAlertToast}
      />

      <AlertToast alertToast={alertToast} />
    </Stack>
  )
}

export default Settings
