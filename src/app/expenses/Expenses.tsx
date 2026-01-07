"use client"

import LineChart from "@/components/LineChart"
import { expenseLinesLight, expenseLinesDark } from "@/globals/colors"
import { EXPENSE_CATEGORIES_KEY, EXPENSES, YEARS_KEY } from "@/globals/globals"
import { Box } from "@mui/material"
import { useTheme } from "next-themes"
import { useState, useMemo } from "react"
import { useTransactionContext } from "@/contexts/transactions-context"
import 
  EditTransactionDetailDialog 
from "@/components/EditTransactionDetailDialog"
import { buildMultiColumnData } from "@/utils/buildChartData"
import MockDataWarning from "@/components/MockDataWarning"
import { usePathname } from "next/navigation"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import { getChoices } from "@/utils/choiceStorage"
import { FlexColWrapper } from "@/components/Wrappers"
import { useCategoryContext } from "@/contexts/categories-context"
import AddExpenses from "./AddExpenses"
import ExpenseList from "./ExpenseList"

const Expenses = () => {
  const { 
    expenseTransactions, 
    refreshExpenseTransactions } = useTransactionContext()
  const { expenseCategories, years, excludedSet } = useCategoryContext()
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

  const lineChartData = useMemo(() => {
    return buildMultiColumnData({
      firstData: expenseTransactions,
      firstColumnTitle: "Month",
      method: "self"
    }) ?? []
  }, [expenseTransactions])

  const lineColors = currentTheme === "light" 
    ? expenseLinesLight
    : expenseLinesDark

  return (
    <FlexColWrapper gap={2}>
      <MockDataWarning pathname={pathname}/>

      {hasChoices &&
        <Box display={hasChoices? "flex" : "none"}>
          <AddExpenses
            expenseCategories={expenseCategories}
            expenses={EXPENSES}
            refreshExpenseTransactions={refreshExpenseTransactions}
            years={years}
          />
        </Box>
      }

      <FlexColWrapper gap={2} toRowBreak={"xl"}>
        <ExpenseList
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          expenses={EXPENSES}
          expenseTransactions={expenseTransactions}
          refreshExpenseTransactions={refreshExpenseTransactions}
          setOpenEditDialog={setOpenEditDialog}
          setSelectedId={setSelectedId}
          excludedSet={excludedSet}
        />
        
        <LineChart
          multiColumnData={lineChartData}
          lineColors={ lineColors }
        />
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
        refreshExpenseTransactions={refreshExpenseTransactions}
      />
    </FlexColWrapper>
  )
}

export default Expenses