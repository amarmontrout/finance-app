"use client"

import LineChart from "@/components/LineChart"
import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionsList from "@/components/TransactionsList"
import { expenseLinesLight, expenseLinesDark } from "@/globals/colors"
import { EXPENSE_CATEGORIES_KEY, EXPENSES, YEARS_KEY } from "@/globals/globals"
import { Box } from "@mui/material"
import { useTheme } from "next-themes"
import { useState, useEffect, useMemo } from "react"
import { useTransactionContext } from "@/contexts/transactions-context"
import 
  EditTransactionDetailDialog 
from "@/components/EditTransactionDetailDialog"
import TransactionForm from "@/components/TransactionForm"
import { buildMultiColumnData } from "@/utils/buildChartData"
import MockDataWarning from "@/components/MockDataWarning"
import { usePathname } from "next/navigation"
import { getMonthTotal } from "@/utils/getTotals"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import { getChoices } from "@/utils/choiceStorage"
import { FlexColWrapper } from "@/components/Wrappers"

const Expenses = () => {
  const { 
    expenseTransactions, 
    refreshExpenseTransactions,
    expenseCategories
  } = useTransactionContext()

  useEffect(() => {
    refreshExpenseTransactions()
  }, [])
  
  const pathname = usePathname()
  const { theme: currentTheme } = useTheme()
  const { currentYear, currentMonth } = getCurrentDateInfo()

  const [selectedYear, setSelectedYear] = useState<string>(currentYear)
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth)
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string>("")

  const hasChoices = useMemo(() => {
    return (
      getChoices({ key: YEARS_KEY }).length !== 0 &&
      getChoices({ key: EXPENSE_CATEGORIES_KEY }).length !== 0
    )
  }, [])
  const monthExpense = useMemo(() => {
    return getMonthTotal(selectedYear, selectedMonth, expenseTransactions)
  }, [selectedYear, selectedMonth, expenseTransactions])
  const lineChartData = useMemo(() => {
    return buildMultiColumnData({
      firstData: expenseTransactions,
      firstColumnTitle: "Month",
      method: "self"
    }) ?? []
  }, [expenseTransactions])

  return (
    <FlexColWrapper gap={2}>
      <MockDataWarning pathname={pathname}/>

      {hasChoices &&
        <Box display={hasChoices? "flex" : "none"}>
          <ShowCaseCard title={"Add Expense"}>
            <TransactionForm
              categories={expenseCategories}
              type={EXPENSES}
              refreshTransactions={refreshExpenseTransactions}
            />
          </ShowCaseCard>
        </Box>
      }

      <FlexColWrapper gap={2} toRowBreak={"xl"}>
        <ShowCaseCard 
          title={`Expenses for ${selectedMonth} ${selectedYear}`} 
          secondaryTitle={`$${monthExpense}`}
        >
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
        
        <ShowCaseCard title={"Expenses Chart"}>
          <LineChart
            multiColumnData={lineChartData}
            lineColors={
              currentTheme === "light" 
              ? expenseLinesLight
              : expenseLinesDark
            }
          />
        </ShowCaseCard>
      </FlexColWrapper>

      <EditTransactionDetailDialog
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        type={EXPENSES}
        selectedId={selectedId}
        transactions={expenseTransactions}
        categories={expenseCategories}
        currentTheme={currentTheme}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
      />
    </FlexColWrapper>
  )
}

export default Expenses