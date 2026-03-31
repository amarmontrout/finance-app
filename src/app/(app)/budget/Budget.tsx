"use client"

import { useMemo, useRef, useState } from "react"
import { getCurrentDateInfo, getWeekBounds } from "@/utils/helperFunctions"
import { Divider, Stack } from "@mui/material"
import { useTransactionContext } from "@/contexts/transactions-context"
import { useCategoryContext } from "@/contexts/categories-context"
import {
  AlertToastType,
  BudgetType,
  DateType,
  NewTransactionType,
} from "@/utils/type"
import AddDataButton from "@/components/AddDataButton"
import WeekSelector from "@/components/WeekSelector"
import AlertToast from "@/components/AlertToast"
import BudgetTransactions from "./BudgetTransactions"
import AddEditDialog from "../../../components/AddEditDialog"
import WeekTotalBudget from "./WeekTotalBudget"
import AddBudgetDialog from "./AddBudgetDialog"
import EditBudgetDialog from "../settings/EditBudgetDialog"

const Budget = () => {
  const { isLoading, transactions, refreshTransactions } =
    useTransactionContext()
  const {
    incomeCategories,
    expenseCategories,
    budgetCategories,
    loadCategories,
  } = useCategoryContext()
  const { currentYear, currentDay, currentMonth } = getCurrentDateInfo()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [weekOffset, setWeekOffset] = useState<number>(0)
  const [selectedTransaction, setSelectedTransaction] =
    useState<NewTransactionType | null>(null)
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [openBudgetDialog, setOpenBudgetDialog] = useState<boolean>(false)
  const [alertToast, setAlertToast] = useState<AlertToastType>()
  const [type, setType] = useState<"income" | "expense">("expense")
  const [confirmSelection, setConfirmSelection] = useState<BudgetType | null>(
    null,
  )
  const [budgetEditDialogOpen, setBudgetEditDialogOpen] =
    useState<boolean>(false)
  const [confirmEdit, setConfirmEdit] = useState<BudgetType | null>(null)

  const TODAY: DateType = {
    month: currentMonth,
    day: currentDay,
    year: currentYear,
  }
  const week = useMemo(() => {
    return getWeekBounds(TODAY, weekOffset)
  }, [TODAY, weekOffset])

  return (
    <Stack spacing={2} pb={"58px"}>
      <WeekSelector
        week={week}
        weekOffset={weekOffset}
        setWeekOffset={setWeekOffset}
      />

      <BudgetTransactions
        transactions={transactions}
        refreshTransactions={refreshTransactions}
        budgetCategories={budgetCategories}
        setSelectedTransaction={setSelectedTransaction}
        setAlertToast={setAlertToast}
        setOpenDialog={setOpenEditDialog}
        isLoading={isLoading}
        week={week}
      />
      <Divider />
      <WeekTotalBudget
        transactions={transactions}
        week={week}
        isLoading={isLoading}
        budgetCategories={budgetCategories}
      />

      <AddEditDialog
        openDialog={openEditDialog}
        setOpenDialog={setOpenEditDialog}
        setAlertToast={setAlertToast}
        incomeCategories={incomeCategories}
        expenseCategories={expenseCategories}
        inputRef={inputRef}
        refreshTransactions={refreshTransactions}
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={setSelectedTransaction}
        transactions={transactions}
        type={type}
        setType={setType}
      />

      <AddBudgetDialog
        openBudgetDialog={openBudgetDialog}
        setOpenBudgetDialog={setOpenBudgetDialog}
        confirmSelection={confirmSelection}
        setConfirmSelection={setConfirmSelection}
        setBudgetEditDialogOpen={setBudgetEditDialogOpen}
        setConfirmEdit={setConfirmEdit}
        budgetCategories={budgetCategories}
        loadCategories={loadCategories}
        expenseCategories={expenseCategories}
        inputRef={inputRef}
        setAlertToast={setAlertToast}
      />

      <EditBudgetDialog
        budgetEditDialogOpen={budgetEditDialogOpen}
        setBudgetEditDialogOpen={setBudgetEditDialogOpen}
        confirmEdit={confirmEdit}
        setAlertToast={setAlertToast}
        inputRef={inputRef}
      />

      <AlertToast alertToast={alertToast} />

      <AddDataButton
        action={() => {
          setOpenBudgetDialog(true)
        }}
      />
    </Stack>
  )
}

export default Budget
