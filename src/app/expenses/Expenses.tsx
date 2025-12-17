"use client"

import LineChart from "@/components/LineChart"
import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionsList from "@/components/TransactionsList"
import { expenseLinesLight, expenseLinesDark } from "@/globals/colors"
import { EXPENSE_CATEGORIES, EXPENSES } from "@/globals/globals"
import { Box } from "@mui/material"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { useTransactionContext } from "@/contexts/transactions-context"
import EditTransactionDetailDialog from "@/components/EditTransactionDetailDialog"
import TransactionForm from "@/components/TransactionForm"

const Expenses = () => {
  const { 
    expenseTransactions, 
    refreshExpenseTransactions,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    getMonthExpenseTotal,
  } = useTransactionContext()

  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string>("")

  const monthTotal = getMonthExpenseTotal()
  const theme = useTheme()
  const currentTheme = theme.theme

  useEffect(() => {
    refreshExpenseTransactions()
  }, [])

  return (
    <Box
      className="flex flex-col gap-2 h-full"
    >
      <ShowCaseCard title={"Add Expense"} secondaryTitle={""}>
        <TransactionForm
          categories={EXPENSE_CATEGORIES}
          type={EXPENSES}
          refreshTransactions={refreshExpenseTransactions}
        />
      </ShowCaseCard>

      <Box
        className="flex flex-col xl:flex-row gap-2 h-full"
      >
        <ShowCaseCard title={`Expenses for ${selectedMonth} ${selectedYear}`} secondaryTitle={`Total ${monthTotal}`}>
          <TransactionsList
            type={EXPENSES}
            transactions={expenseTransactions}
            refreshTransactions={refreshExpenseTransactions}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            setOpenEditDialog={setOpenEditDialog}
            setSelectedId={setSelectedId}
          />
        </ShowCaseCard>
        
        <ShowCaseCard title={"Expenses Chart"} secondaryTitle={""}>
          <LineChart
            selectedYear={selectedYear}
            transactions={expenseTransactions}
            title={"Expenses"}
            lineColors={
              currentTheme === "light" 
              ? expenseLinesLight
              : expenseLinesDark
            }
            height="400px"
          />
        </ShowCaseCard>
      </Box>

      <EditTransactionDetailDialog
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        type={EXPENSES}
        selectedId={selectedId}
        transactions={expenseTransactions}
        categories={EXPENSE_CATEGORIES}
        currentTheme={currentTheme}
      />
    </Box>
  )
}

export default Expenses