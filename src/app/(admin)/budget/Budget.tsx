"use client"

import { BudgetType } from "@/api/choices/models"
import { TransactionType } from "@/api/transactions/models"
import { useCategoryContext } from "@/contexts/categories-context"
import { useTransactionContext } from "@/contexts/transaction-context"
import AddDataButton from "@/global/components/AddDataButton"
import AddEditDialog from "@/global/components/AddEditDialog"
import AlertToast from "@/global/components/AlertToast"
import MonthYearSelector from "@/global/components/MonthYearSelector"
import { getTransactionsByType } from "@/global/dataFunctions"
import { getCurrentDateInfo } from "@/global/infoFunctions"
import { AlertToastType, SelectedDateType } from "@/types/types"
import { Stack } from "@mui/material"
import { useMemo, useRef, useState } from "react"
import AddBudgetDialog from "./_components/AddBudgetDialog"
import EditBudgetDialog from "./_components/EditBudgetDialog"
import BudgetTransactions from "./BudgetTransactions"

const Budget = () => {
  const { isLoading, transactions, refreshTransactions } =
    useTransactionContext()
  const {
    incomeCategories,
    expenseCategories,
    budgetCategories,
    loadCategories,
  } = useCategoryContext()
  const { today } = getCurrentDateInfo()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const CURRENT_DATE = {
    month: today.month,
    year: today.year,
  }

  const [selectedDate, setSelectedDate] =
    useState<SelectedDateType>(CURRENT_DATE)
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionType | null>(null)
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

  const monthExpenseTransactions = useMemo(() => {
    return getTransactionsByType({
      transactions: transactions,
      type: "expense",
      month: selectedDate.month,
      year: selectedDate.year,
    })
  }, [transactions, selectedDate])

  const resetSelectedDate = () => {
    setSelectedDate(CURRENT_DATE)
  }

  return (
    <Stack direction={"column"} spacing={1.5} sx={{ paddingBottom: "50px" }}>
      <MonthYearSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        resetSelectedDate={resetSelectedDate}
        showMonth={true}
      />

      <BudgetTransactions
        transactions={monthExpenseTransactions}
        refreshTransactions={refreshTransactions}
        budgetCategories={budgetCategories}
        setSelectedTransaction={setSelectedTransaction}
        setAlertToast={setAlertToast}
        setOpenDialog={setOpenEditDialog}
        isLoading={isLoading}
        setBudgetEditDialogOpen={setBudgetEditDialogOpen}
        setConfirmEdit={setConfirmEdit}
        inputRef={inputRef}
        selectedDate={selectedDate}
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
        budgetCategories={budgetCategories}
        loadCategories={loadCategories}
        expenseCategories={expenseCategories}
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
