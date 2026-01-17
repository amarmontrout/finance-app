"use client"

import LineChart from "@/components/LineChart"
import { expenseLinesLight, expenseLinesDark } from "@/globals/colors"
import { EXPENSES } from "@/globals/globals"
import { Box } from "@mui/material"
import { useTheme } from "next-themes"
import { useState, useMemo } from "react"
import { useTransactionContext } from "@/contexts/transactions-context"
import 
  EditTransactionDetailDialog
from "@/components/EditTransactionDetailDialog"
import { buildMultiColumnDataV2 } from "@/utils/buildChartData"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import { FlexColWrapper } from "@/components/Wrappers"
import { useCategoryContext } from "@/contexts/categories-context"
import AddExpenses from "./AddExpenses"
import ExpenseList from "./ExpenseList"
import ShowCaseCard from "@/components/ShowCaseCard"

const Expenses = () => {
  const {
    expenseTransactionsV2,
    refreshExpenseTransactionsV2
  } = useTransactionContext()
  const { excludedSet, expenseCategoriesV2, yearsV2 } = useCategoryContext()
  const { theme: currentTheme } = useTheme()
  const { currentYear, currentMonth } = getCurrentDateInfo()
  
  const [selectedYear, setSelectedYear] = useState<string>(currentYear)
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth)
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { lineChartData, lineColors } = useMemo(() => {
    const lineChartData = buildMultiColumnDataV2({
      firstData: expenseTransactionsV2,
      firstColumnTitle: "Month",
      method: "self",
      excludedSet: excludedSet
    })
    const lineColors = currentTheme === "light" 
      ? expenseLinesLight
      : expenseLinesDark
    return{ lineChartData, lineColors }
  }, [expenseTransactionsV2, currentTheme])

  return (
    <FlexColWrapper gap={2}>
      <Box>
        <AddExpenses
          expenseCategories={expenseCategoriesV2}
          expenses={EXPENSES}
          refreshExpenseTransactions={refreshExpenseTransactionsV2}
          years={yearsV2}
        />
      </Box>

      <FlexColWrapper gap={2} toRowBreak={"xl"}>
        <ExpenseList
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          expenses={EXPENSES}
          expenseTransactions={expenseTransactionsV2}
          refreshExpenseTransactions={refreshExpenseTransactionsV2}
          setOpenEditDialog={setOpenEditDialog}
          setSelectedId={setSelectedId}
          excludedSet={excludedSet}
        />

        <ShowCaseCard title={"Expenses"}>
          <LineChart
            multiColumnData={lineChartData}
            lineColors={ lineColors }
          />
        </ShowCaseCard>
      </FlexColWrapper>

      <EditTransactionDetailDialog
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        type={EXPENSES}
        selectedId={selectedId}
        transactions={expenseTransactionsV2}
        categories={expenseCategoriesV2}
        currentTheme={currentTheme}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        refreshExpenseTransactions={refreshExpenseTransactionsV2}
      />
    </FlexColWrapper>
  )
}

export default Expenses