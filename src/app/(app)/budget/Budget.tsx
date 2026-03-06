"use client"

import { useMemo, useRef, useState } from "react"
import { getCurrentDateInfo, getWeekBounds } from "@/utils/helperFunctions"
import { Stack } from "@mui/material"
import { useTransactionContext } from "@/contexts/transactions-context"
import { useCategoryContext } from "@/contexts/categories-context"
import { AlertToastType, DateType, NewTransactionType } from "@/utils/type"
import AddDataButton from "@/components/AddDataButton"
import WeekSelector from "@/components/WeekSelector"
import AlertToast from "@/components/AlertToast"
import BudgetTransactions from "./BudgetTransactions"
import AddEditDialog from "../../../components/AddEditDialog"

const Budget = () => {
  const { isLoading, transactions, refreshTransactions } =
    useTransactionContext()
  const { incomeCategories, expenseCategories } = useCategoryContext()
  const { currentYear, currentDay, currentMonth } = getCurrentDateInfo()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [weekOffset, setWeekOffset] = useState<number>(0)
  const [selectedTransaction, setSelectedTransaction] =
    useState<NewTransactionType | null>(null)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [alertToast, setAlertToast] = useState<AlertToastType>()

  const TODAY: DateType = {
    month: currentMonth,
    day: currentDay,
    year: currentYear,
  }
  const week = useMemo(() => {
    return getWeekBounds(TODAY, weekOffset)
  }, [TODAY, weekOffset])

  return (
    <Stack spacing={1.5}>
      <WeekSelector
        week={week}
        weekOffset={weekOffset}
        setWeekOffset={setWeekOffset}
      />

      <BudgetTransactions
        transactions={transactions}
        refreshTransactions={refreshTransactions}
        setSelectedTransaction={setSelectedTransaction}
        setAlertToast={setAlertToast}
        setOpenDialog={setOpenDialog}
        isLoading={isLoading}
        week={week}
      />

      <AddEditDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        setAlertToast={setAlertToast}
        incomeCategories={incomeCategories}
        expenseCategories={expenseCategories}
        inputRef={inputRef}
        refreshTransactions={refreshTransactions}
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={setSelectedTransaction}
        transactions={transactions}
      />

      <AlertToast alertToast={alertToast} />

      <AddDataButton
        action={() => {
          setOpenDialog(true)
          setTimeout(() => {
            inputRef.current?.focus()
          }, 50)
        }}
      />
    </Stack>
  )
}

export default Budget
