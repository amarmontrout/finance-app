"use client"

import { Box, Tabs, Tab, Stack } from "@mui/material"
import { useCategoryContext } from "@/contexts/categories-context"
import { useEffect, useRef, useState } from "react"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import { useTheme } from "next-themes"
import { useTransactionContext } from "@/contexts/transactions-context"
import {
  AlertToastType,
  NewTransactionType,
  SelectedDateType,
} from "@/utils/type"
import TransactionTotals from "./TransactionTotals"
import MonthYearSelector from "@/components/MonthYearSelector"
import AddDataButton from "@/components/AddDataButton"
import AlertToast from "@/components/AlertToast"
import TransactionsDisplay from "./TransactionsDisplay"
import AddEditDialog from "../../../components/AddEditDialog"

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
    incomeTransactions,
    expenseTransactions,
    isLoading,
    transactions,
    refreshTransactions,
  } = useTransactionContext()
  const { incomeCategories, expenseCategories, excludedSet } =
    useCategoryContext()
  const { currentYear, currentMonth, passedMonths } = getCurrentDateInfo()
  const { theme: currentTheme } = useTheme()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const CURRENT_DATE = {
    month: currentMonth,
    year: currentYear,
  }

  const [selectedDate, setSelectedDate] =
    useState<SelectedDateType>(CURRENT_DATE)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [alertToast, setAlertToast] = useState<AlertToastType>()
  const [tab, setTab] = useState(0)

  const [selectedTransaction, setSelectedTransaction] =
    useState<NewTransactionType | null>(null)

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
          {/* <Tab label="Totals" /> */}
        </Tabs>
      </Box>

      <MonthYearSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        resetSelectedDate={resetSelectedDate}
        showMonth={tab === 0}
      />

      <TabPanel value={tab} index={0}>
        <TransactionsDisplay
          transactions={transactions}
          refreshTransactions={refreshTransactions}
          selectedDate={selectedDate}
          setAlertToast={setAlertToast}
          selectedTransaction={selectedTransaction}
          setSelectedTransaction={setSelectedTransaction}
          isLoading={isLoading}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          currentTheme={currentTheme}
        />
      </TabPanel>

      {/* <TabPanel value={tab} index={1}>
        <TransactionTotals
          selectedYear={selectedDate.year}
          currentYear={currentYear}
          passedMonths={passedMonths}
          incomeTransactions={incomeTransactions}
          expenseTransactions={expenseTransactions}
          excludedSet={excludedSet}
        />
      </TabPanel> */}

      <AddEditDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        setAlertToast={setAlertToast}
        incomeCategories={incomeCategories}
        expenseCategories={expenseCategories}
        inputRef={inputRef}
        refreshTransactions={refreshTransactions}
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={setSelectedTransaction}
        transactions={transactions}
      />

      <AlertToast alertToast={alertToast} />

      <AddDataButton
        action={() => {
          setOpenDialog(true)
          setTimeout(() => {
            inputRef.current?.focus()
          }, 50)
        }}
      />
    </Stack>
  )
}

export default Transactions
