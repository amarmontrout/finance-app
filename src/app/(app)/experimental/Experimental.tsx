"use client"

import AddDataButton from "@/components/AddDataButton"
import { Stack } from "@mui/material"
import { useRef, useState } from "react"
import {
  AlertToastType,
  DateType,
  NewTransactionType,
  SelectedDateType,
} from "@/utils/type"
import AlertToast from "@/components/AlertToast"
import { useCategoryContext } from "@/contexts/categories-context"
import { useTransactionContext } from "@/contexts/transactions-context"
import MonthYearSelector from "@/components/MonthYearSelector"
import { getCurrentDateInfo, getWeekBounds } from "@/utils/helperFunctions"
import { useTheme } from "next-themes"
import AddEditDialog from "./AddEditDialog"
import BudgetTransactions from "./BudgetTransactions"
import WeekSelector from "@/components/WeekSelector"
import MonthlySummary from "./MonthlySummary"
import WeeklyBudget from "./WeeklyBudget"
import TopMonthlyExpenses from "./TopMonthlyExpenses"
import TransactionsDisplay from "./TransactionsDisplay"

const Experimental = () => {
  const { transactions, refreshTransactions, isLoading } =
    useTransactionContext()
  const { incomeCategoriesV2, expenseCategoriesV2, budgetCategoriesV2 } =
    useCategoryContext()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { theme: currentTheme } = useTheme()
  const { currentYear, currentMonth, currentDay } = getCurrentDateInfo()

  const CURRENT_DATE = { month: currentMonth, year: currentYear }
  const TODAY: DateType = {
    month: currentMonth,
    day: currentDay,
    year: currentYear,
  }

  const [weekOffset, setWeekOffset] = useState<number>(0)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [alertToast, setAlertToast] = useState<AlertToastType | undefined>()
  const [selectedDate, setSelectedDate] =
    useState<SelectedDateType>(CURRENT_DATE)
  const [selectedTransaction, setSelectedTransaction] =
    useState<NewTransactionType | null>(null)

  const week = getWeekBounds(TODAY, weekOffset)

  const resetSelectedDate = () => {
    setSelectedDate(CURRENT_DATE)
  }

  return (
    <Stack spacing={1.5}>
      <MonthYearSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        resetSelectedDate={resetSelectedDate}
        showMonth={true}
      />

      <WeekSelector
        week={week}
        weekOffset={weekOffset}
        setWeekOffset={setWeekOffset}
      />

      <TransactionsDisplay
        transactions={transactions}
        refreshTransactions={refreshTransactions}
        selectedDate={selectedDate}
        setAlertToast={setAlertToast}
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={setSelectedTransaction}
        isLoading={isLoading}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        currentTheme={currentTheme}
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

      <MonthlySummary
        transactions={transactions}
        currentMonth={currentMonth}
        currentYear={currentYear}
        currentTheme={currentTheme}
        isLoading={isLoading}
      />

      <WeeklyBudget
        transactions={transactions}
        budgetCategoriesV2={budgetCategoriesV2}
        currentMonth={currentMonth}
        currentDay={currentDay}
        currentYear={currentYear}
        currentTheme={currentTheme}
        isLoading={isLoading}
      />

      <TopMonthlyExpenses
        transactions={transactions}
        currentMonth={currentMonth}
        currentYear={currentYear}
        currentTheme={currentTheme}
        isLoading={isLoading}
      />

      <AddEditDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        setAlertToast={setAlertToast}
        incomeCategoriesV2={incomeCategoriesV2}
        expenseCategoriesV2={expenseCategoriesV2}
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

export default Experimental
