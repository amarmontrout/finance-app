"use client"

import AddDataButton from "@/components/AddDataButton"
import AlertToast from "@/components/AlertToast"
import WeekSelector from "@/components/WeekSelector"
import { useCategoryContext } from "@/contexts/categories-context"
import { useTransactionContext } from "@/contexts/transactions-context"
import { neutralColor } from "@/globals/colors"
import { getCurrentDateInfo, getWeekBounds } from "@/utils/helperFunctions"
import {
  AlertToastType,
  BudgetType,
  DateType,
  TransactionType,
} from "@/utils/type"
import { Button, Divider, Stack } from "@mui/material"
import { useMemo, useRef, useState } from "react"
import AddEditDialog from "../../../components/AddEditDialog"
import EditBudgetDialog from "../settings/EditBudgetDialog"
import AddBudgetDialog from "./AddBudgetDialog"
import BudgetTransactions from "./BudgetTransactions"
import MonthlyBudget from "./MonthlyBudget"
import WeekTotalBudget from "./WeekTotalBudget"

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

  const TODAY: DateType = {
    month: currentMonth,
    day: currentDay,
    year: currentYear,
  }
  const week = useMemo(() => {
    return getWeekBounds(TODAY, weekOffset)
  }, [TODAY, weekOffset])

  // Experimental ==============================================================
  const [showExp, setShowExp] = useState<boolean>(false)
  const handleExp = () => {
    setShowExp(!showExp)
  }
  // ===========================================================================

  return (
    <>
      <Stack
        spacing={2}
        pb={"58px"}
        divider={<Divider sx={{ borderColor: neutralColor.color }} />}
      >
        {!showExp && (
          <>
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

            <WeekTotalBudget
              transactions={transactions}
              week={week}
              budgetCategories={budgetCategories}
            />
          </>
        )}

        {showExp && (
          <>
            <MonthlyBudget
              transactions={transactions}
              budgetCategories={budgetCategories}
              currentMonth={currentMonth}
              currentDay={currentDay}
              currentYear={currentYear}
            />
          </>
        )}

        <Button
          variant="contained"
          onClick={handleExp}
        >{`Show Exp: ${showExp}`}</Button>
      </Stack>

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
    </>
  )
}

export default Budget
