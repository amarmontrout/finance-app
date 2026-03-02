"use client"

import TransactionFeed from "./TransactionFeed"
import { Box, Tabs, Tab, Stack } from "@mui/material"
import { useCategoryContext } from "@/contexts/categories-context"
import { useEffect, useState } from "react"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import { useTheme } from "next-themes"
import { useTransactionContext } from "@/contexts/transactions-context"
import EditTransactionDetailDialog from "@/app/(app)/transactions/EditTransactionDetailDialog"
import { SelectedDateType, SelectedTransactionType } from "@/utils/type"
import TransactionTotals from "./TransactionTotals"
import AddTransactionDialog from "./AddTransactionDialog"
import MonthYearSelector from "@/components/MonthYearSelector"
import AddDataButton from "@/components/AddDataButton"

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
    <div hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

const Transactions = () => {
  const {
    incomeTransactionsV2,
    refreshIncomeTransactionsV2,
    expenseTransactionsV2,
    refreshExpenseTransactionsV2,
  } = useTransactionContext()
  const { yearsV2, incomeCategoriesV2, expenseCategoriesV2, excludedSet } =
    useCategoryContext()
  const { currentYear, currentMonth, passedMonths } = getCurrentDateInfo()
  const { theme: currentTheme } = useTheme()

  const CURRENT_DATE = {
    month: currentMonth,
    year: currentYear,
  }

  const [selectedDate, setSelectedDate] =
    useState<SelectedDateType>(CURRENT_DATE)
  const [openAddTransactionDialog, setOpenAddTransactionDialog] =
    useState<boolean>(false)
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [tab, setTab] = useState(0)
  const [selectedTransaction, setSelectedTransaction] =
    useState<SelectedTransactionType | null>(null)

  const resetSelectedDate = () => {
    setSelectedDate(CURRENT_DATE)
  }

  useEffect(() => {
    resetSelectedDate()
  }, [tab])

  return (
    <Stack spacing={1.5}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={(_event: React.SyntheticEvent, newValue: number) => {
            setTab(newValue)
          }}
        >
          <Tab label="Transactions" />
          <Tab label="Totals" />
        </Tabs>
      </Box>

      <MonthYearSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        resetSelectedDate={resetSelectedDate}
        showMonth={tab === 0}
      />

      <TabPanel value={tab} index={0}>
        <TransactionFeed
          selectedMonth={selectedDate.month}
          selectedYear={selectedDate.year}
          currentTheme={currentTheme}
          selectedTransaction={selectedTransaction}
          setSelectedTransaction={setSelectedTransaction}
          openEditDialog={openEditDialog}
          setOpenEditDialog={setOpenEditDialog}
        />
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <TransactionTotals
          selectedYear={selectedDate.year}
          currentYear={currentYear}
          passedMonths={passedMonths}
          incomeTransactionsV2={incomeTransactionsV2}
          expenseTransactionsV2={expenseTransactionsV2}
          excludedSet={excludedSet}
        />
      </TabPanel>

      <AddTransactionDialog
        openAddTransactionDialog={openAddTransactionDialog}
        setOpenAddTransactionDialog={setOpenAddTransactionDialog}
        incomeCategoriesV2={incomeCategoriesV2}
        refreshIncomeTransactionsV2={refreshIncomeTransactionsV2}
        expenseCategoriesV2={expenseCategoriesV2}
        refreshExpenseTransactionsV2={refreshExpenseTransactionsV2}
        yearsV2={yearsV2}
      />

      <EditTransactionDetailDialog
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={setSelectedTransaction}
        transactions={
          selectedTransaction?.type === "income"
            ? incomeTransactionsV2
            : expenseTransactionsV2
        }
        categories={
          selectedTransaction?.type === "income"
            ? incomeCategoriesV2
            : expenseCategoriesV2
        }
        currentTheme={currentTheme}
        selectedYear={selectedDate.year}
        selectedMonth={selectedDate.month}
        refreshIncomeTransactions={refreshIncomeTransactionsV2}
        refreshExpenseTransactions={refreshExpenseTransactionsV2}
      />

      <AddDataButton
        action={() => {
          setOpenAddTransactionDialog(true)
        }}
      />
    </Stack>
  )
}

export default Transactions
