"use client"

import LineChart from "@/components/LineChart"
import { expenseLinesLight, expenseLinesDark } from "@/globals/colors"
import { EXPENSES } from "@/globals/globals"
import { Box, Tab, Tabs } from "@mui/material"
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
  const [value, setValue] = useState(0)

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

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  }
  
  const TabPanel = ({ 
    children, 
    value, 
    index, 
    ...other 
  }: {
    children?: React.ReactNode
    index: number
    value: number
  }) => {
    return (
      <div hidden={value !== index} {...other} >
        {
          value === index 
            && <Box>{children}</Box>
        }
      </div>
    )
  }

  return (
    <FlexColWrapper gap={2}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Add Expense"/>
          <Tab label="Expense List"/>
          <Tab label="Expense Chart"/>
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <AddExpenses
          expenseCategories={expenseCategoriesV2}
          expenses={EXPENSES}
          refreshExpenseTransactions={refreshExpenseTransactionsV2}
          years={yearsV2}
        />
      </TabPanel>

      <TabPanel value={value} index={1}>
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
      </TabPanel>

      <TabPanel value={value} index={2}>
        <ShowCaseCard title={"Expenses"}>
          <LineChart
            multiColumnData={lineChartData}
            lineColors={ lineColors }
          />
        </ShowCaseCard>
      </TabPanel>

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