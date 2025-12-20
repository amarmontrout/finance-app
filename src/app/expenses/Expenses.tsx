"use client"

import LineChart from "@/components/LineChart"
import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionsList from "@/components/TransactionsList"
import { expenseLinesLight, expenseLinesDark } from "@/globals/colors"
import { EXPENSE_CATEGORIES_KEY, EXPENSES, YEARS_KEY } from "@/globals/globals"
import { Alert, Box } from "@mui/material"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { useTransactionContext } from "@/contexts/transactions-context"
import EditTransactionDetailDialog from "@/components/EditTransactionDetailDialog"
import TransactionForm from "@/components/TransactionForm"
import { buildMultiColumnData, MultiColumnDataType } from "@/utils/buildChartData"
import getChoices from "@/utils/getChoices"

const Expenses = () => {
  const { 
    expenseTransactions, 
    refreshExpenseTransactions,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    getMonthExpenseTotal,
    expenseCategories
  } = useTransactionContext()

  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string>("")
  const [lineChartData, setLineChartData] = useState<MultiColumnDataType>([])
  const [hasChoices, setHasChoices] = useState<boolean>(false)

  const monthTotal = getMonthExpenseTotal()
  const theme = useTheme()
  const currentTheme = theme.theme

  useEffect(() => {
    refreshExpenseTransactions()
    const yearsChoices = getChoices({key: YEARS_KEY})
    const expenseChoices = getChoices({key: EXPENSE_CATEGORIES_KEY})
    if (yearsChoices.length !== 0 && expenseChoices.length !== 0) {
      setHasChoices(true)
    }
  }, [])

  const buildExpenseChartData = () => {
    const chartData = buildMultiColumnData({
      firstData: expenseTransactions,
      firstColumnTitle: "Month",
      method: "self"
    })
  
    if (!chartData) return
  
    setLineChartData(chartData)
  }
  
  useEffect(() => {
    buildExpenseChartData()
  }, [expenseTransactions])

  return (
    <Box
      className="flex flex-col gap-2 h-full"
    >
      <Box
        sx={{
          display: !hasChoices? "flex" : "none",
          height: "100%",
          alignItems: "center"
        }}
      >
        <Alert severity="error" sx={{width: "100%"}}>
          This contains mock data. 
          Go to settings and add a year and/or an expense category. Then come back here to enter your first expense transaction.
        </Alert>
      </Box>

      <Box display={hasChoices? "flex" : "none"}>
        <ShowCaseCard title={"Add Expense"} secondaryTitle={""}>
          <TransactionForm
            categories={expenseCategories}
            type={EXPENSES}
            refreshTransactions={refreshExpenseTransactions}
          />
        </ShowCaseCard>
      </Box>

      <Box
        className="flex flex-col xl:flex-row gap-2 h-full"
      >
        <ShowCaseCard title={`Expenses for ${selectedMonth} ${selectedYear}`} secondaryTitle={`Total $${monthTotal}`}>
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
            multiColumnData={lineChartData}
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
        categories={expenseCategories}
        currentTheme={currentTheme}
      />
    </Box>
  )
}

export default Expenses