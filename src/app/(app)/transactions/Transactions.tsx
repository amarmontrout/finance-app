"use client"

import { FlexColWrapper } from "@/components/Wrappers"
import TransactionFeed from "./TransactionFeed"
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Tabs,
  Tab,
  Stack,
} from "@mui/material"
import { useCategoryContext } from "@/contexts/categories-context"
import { useEffect, useState } from "react"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import { useTheme } from "next-themes"
import { MONTHS } from "@/globals/globals"
import { useTransactionContext } from "@/contexts/transactions-context"
import AddIncomeDialog from "../income/AddIncomeDialog"
import AddExpenseDialog from "../expenses/AddExpenseDialog"
import EditTransactionDetailDialog from "@/components/EditTransactionDetailDialog"
import { SelectedTransactionType } from "@/utils/type"
import AddTransactionButtons from "./AddTransactionButtons"
import TransactionTotals from "./TransactionTotals"

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
  const { currentYear, currentMonth } = getCurrentDateInfo()
  const { theme: currentTheme } = useTheme()

  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth)
  const [openAddIncomeDialog, setOpenAddIncomeDialog] = useState<boolean>(false)
  const [openAddExpenseDialog, setOpenAddExpenseDialog] =
    useState<boolean>(false)
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [tab, setTab] = useState(0)
  const [selectedTransaction, setSelectedTransaction] =
    useState<SelectedTransactionType | null>(null)

  useEffect(() => {
    setSelectedYear(currentYear)
    setSelectedMonth(currentMonth)
  }, [tab])

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  return (
    <FlexColWrapper gap={3}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tab} onChange={handleChangeTab}>
          <Tab label="Totals" />
          <Tab label="Transactions" />
        </Tabs>
      </Box>

      <Stack direction={"row"} spacing={2}>
        {tab !== 0 && (
          <FormControl fullWidth>
            <InputLabel>Month</InputLabel>
            <Select
              className="w-full sm:w-[175px]"
              label="Month"
              value={selectedMonth}
              name={"month"}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {MONTHS.map((month) => {
                return (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        )}

        <FormControl fullWidth>
          <InputLabel>Year</InputLabel>
          <Select
            className="w-full sm:w-[175px]"
            label="Year"
            value={selectedYear}
            name={"year"}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {yearsV2.map((year) => {
              return (
                <MenuItem key={year.name} value={year.name}>
                  {year.name}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
      </Stack>

      <AddTransactionButtons
        setOpenAddIncomeDialog={setOpenAddIncomeDialog}
        setOpenAddExpenseDialog={setOpenAddExpenseDialog}
        currentTheme={currentTheme}
      />

      <TabPanel value={tab} index={0}>
        <TransactionTotals
          selectedYear={selectedYear}
          incomeTransactionsV2={incomeTransactionsV2}
          expenseTransactionsV2={expenseTransactionsV2}
          excludedSet={excludedSet}
        />
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <TransactionFeed
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          currentTheme={currentTheme}
          selectedTransaction={selectedTransaction}
          setSelectedTransaction={setSelectedTransaction}
          setOpenEditDialog={setOpenEditDialog}
        />
      </TabPanel>

      <AddIncomeDialog
        incomeCategories={incomeCategoriesV2}
        income={"income"}
        refreshIncomeTransactions={refreshIncomeTransactionsV2}
        years={yearsV2}
        openAddIncomeDialog={openAddIncomeDialog}
        setOpenAddIncomeDialog={setOpenAddIncomeDialog}
      />

      <AddExpenseDialog
        expenseCategories={expenseCategoriesV2}
        expenses={"expenses"}
        refreshExpenseTransactions={refreshExpenseTransactionsV2}
        years={yearsV2}
        openAddExpenseDialog={openAddExpenseDialog}
        setOpenAddExpenseDialog={setOpenAddExpenseDialog}
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
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        refreshIncomeTransactions={refreshIncomeTransactionsV2}
        refreshExpenseTransactions={refreshExpenseTransactionsV2}
      />
    </FlexColWrapper>
  )
}

export default Transactions
