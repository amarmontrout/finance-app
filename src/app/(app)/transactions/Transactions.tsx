"use client"

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
  IconButton,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { useCategoryContext } from "@/contexts/categories-context"
import { useEffect, useState } from "react"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import { useTheme } from "next-themes"
import { MONTHS } from "@/globals/globals"
import { useTransactionContext } from "@/contexts/transactions-context"
import EditTransactionDetailDialog from "@/app/(app)/transactions/EditTransactionDetailDialog"
import { SelectedTransactionType } from "@/utils/type"
import TransactionTotals from "./TransactionTotals"
import AddTransactionDialog from "./AddTransactionDialog"
import { accentColorPrimary } from "@/globals/colors"

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

  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth)
  const [openAddTransactionDialog, setOpenAddTransactionDialog] =
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
    <Stack spacing={1.5}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tab} onChange={handleChangeTab}>
          <Tab label="Transactions" />
          <Tab label="Totals" />
        </Tabs>
      </Box>

      <Stack
        className="w-full md:w-[50%] 2xl:w-[30%]"
        direction={"row"}
        spacing={2}
        margin={"0 auto"}
      >
        {tab === 0 && (
          <FormControl fullWidth>
            <InputLabel>Month</InputLabel>
            <Select
              className="w-full"
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
            className="w-full"
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

      <TabPanel value={tab} index={0}>
        <TransactionFeed
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          currentTheme={currentTheme}
          selectedTransaction={selectedTransaction}
          setSelectedTransaction={setSelectedTransaction}
          openEditDialog={openEditDialog}
          setOpenEditDialog={setOpenEditDialog}
        />
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <TransactionTotals
          selectedYear={selectedYear}
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
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        refreshIncomeTransactions={refreshIncomeTransactionsV2}
        refreshExpenseTransactions={refreshExpenseTransactionsV2}
      />

      <IconButton
        onClick={() => {
          setOpenAddTransactionDialog(true)
        }}
        size="large"
        disableRipple
        sx={{
          position: "fixed",
          right: "10px",
          bottom: "95px",
          backgroundColor: accentColorPrimary,
          color: "white",
          zIndex: 100,
          boxShadow: `
            0 6px 12px rgba(0,0,0,0.18),
            0 12px 24px rgba(0,0,0,0.18),
            inset 0 1px 0 rgba(255,255,255,0.25)
          `,
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          "&:active": {
            boxShadow: `
              0 3px 6px rgba(0,0,0,0.25),
              inset 0 3px 6px rgba(0,0,0,0.25)
            `,
          },
        }}
      >
        <AddIcon />
      </IconButton>
    </Stack>
  )
}

export default Transactions
