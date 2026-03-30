"use client"

import { Stack } from "@mui/material"
import { useCategoryContext } from "@/contexts/categories-context"
import { useEffect, useRef, useState } from "react"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import { useTheme } from "next-themes"
import { useTransactionContext } from "@/contexts/transactions-context"
import {
  AlertToastType,
  NewTransactionType,
  SelectedDateType,
} from "@/utils/type"
import MonthYearSelector from "@/components/MonthYearSelector"
import AddDataButton from "@/components/AddDataButton"
import AlertToast from "@/components/AlertToast"
import TransactionsDisplay from "./TransactionsDisplay"
import AddEditDialog from "../../../components/AddEditDialog"

const Transactions = () => {
  const { isLoading, transactions, refreshTransactions } =
    useTransactionContext()
  const { incomeCategories, expenseCategories } = useCategoryContext()
  const { currentYear, currentMonth } = getCurrentDateInfo()
  const { theme: currentTheme } = useTheme()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const CURRENT_DATE = {
    month: currentMonth,
    year: currentYear,
  }

  const [selectedDate, setSelectedDate] =
    useState<SelectedDateType>(CURRENT_DATE)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [alertToast, setAlertToast] = useState<AlertToastType>()
  const [tab, setTab] = useState(0)
  const [type, setType] = useState<"income" | "expense">("income")

  const [selectedTransaction, setSelectedTransaction] =
    useState<NewTransactionType | null>(null)

  const resetSelectedDate = () => {
    setSelectedDate(CURRENT_DATE)
  }

  useEffect(() => {
    resetSelectedDate()
  }, [tab])

  return (
    <Stack spacing={1.5}>
      <MonthYearSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        resetSelectedDate={resetSelectedDate}
        showMonth={tab === 0}
      />

      <TransactionsDisplay
        transactions={transactions}
        refreshTransactions={refreshTransactions}
        type={type}
        setType={setType}
        selectedDate={selectedDate}
        setAlertToast={setAlertToast}
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={setSelectedTransaction}
        isLoading={isLoading}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        currentTheme={currentTheme}
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
        type={type}
        setType={setType}
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

export default Transactions
