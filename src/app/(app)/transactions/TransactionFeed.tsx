"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import { useTransactionContext } from "@/contexts/transactions-context"
import { Stack } from "@mui/material"
import { useUser } from "@/hooks/useUser"
import { HookSetter, SelectedTransactionType } from "@/utils/type"
import { useMemo } from "react"
import TransactionList from "./TransactionList"

const TransactionFeed = ({
  selectedMonth,
  selectedYear,
  currentTheme,
  selectedTransaction,
  setSelectedTransaction,
  openEditDialog,
  setOpenEditDialog,
}: {
  selectedMonth: string
  selectedYear: number
  currentTheme: string | undefined
  selectedTransaction: SelectedTransactionType | null
  setSelectedTransaction: HookSetter<SelectedTransactionType | null>
  openEditDialog: boolean
  setOpenEditDialog: HookSetter<boolean>
}) => {
  const {
    incomeTransactionsV2,
    expenseTransactionsV2,
    refreshIncomeTransactionsV2,
    refreshExpenseTransactionsV2,
  } = useTransactionContext()
  const user = useUser()

  const filteredIncome = useMemo(() => {
    return incomeTransactionsV2.filter(
      (t) => t.year === selectedYear && t.month === selectedMonth,
    )
  }, [incomeTransactionsV2, selectedYear, selectedMonth])

  const filteredExpense = useMemo(() => {
    return expenseTransactionsV2.filter(
      (t) => t.year === selectedYear && t.month === selectedMonth,
    )
  }, [expenseTransactionsV2, selectedYear, selectedMonth])

  return (
    <Stack direction={"column"} spacing={2}>
      <ShowCaseCard title={""}>
        <Stack spacing={2}>
          <TransactionList
            title={"Income"}
            transactions={filteredIncome}
            type={"income"}
            user={user}
            selectedTransaction={selectedTransaction}
            setSelectedTransaction={setSelectedTransaction}
            openEditDialog={openEditDialog}
            setOpenEditDialog={setOpenEditDialog}
            refreshIncomeTransactionsV2={refreshIncomeTransactionsV2}
            refreshExpenseTransactionsV2={refreshExpenseTransactionsV2}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            currentTheme={currentTheme}
          />

          <TransactionList
            title={"Expense"}
            transactions={filteredExpense}
            type={"expense"}
            user={user}
            selectedTransaction={selectedTransaction}
            setSelectedTransaction={setSelectedTransaction}
            openEditDialog={openEditDialog}
            setOpenEditDialog={setOpenEditDialog}
            refreshIncomeTransactionsV2={refreshIncomeTransactionsV2}
            refreshExpenseTransactionsV2={refreshExpenseTransactionsV2}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            currentTheme={currentTheme}
          />
        </Stack>
      </ShowCaseCard>
    </Stack>
  )
}

export default TransactionFeed
