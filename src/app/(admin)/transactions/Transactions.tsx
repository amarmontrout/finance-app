"use client"

import { V2TransactionType } from "@/api/v2/models"
import { getTransactionsV2 } from "@/api/v2/requests"
import { useDataContext } from "@/contexts/data-context"
import AddDataButton from "@/global/components/AddDataButton"
import AlertToast from "@/global/components/AlertToast"
import MonthYearSelector from "@/global/components/MonthYearSelector"
import { getNextMonthYear } from "@/global/infoFunctions"
import { AlertToastType } from "@/types/types"
import { Stack } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import TransactionsDisplay from "./TransactionsDisplay"

const Transactions = () => {
  const { accounts, categories, merchants } = useDataContext()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [currentMonthTransactions, setCurrentMonthTransactions] = useState<
    V2TransactionType[]
  >([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [alertToast, setAlertToast] = useState<AlertToastType>()
  const [type, setType] = useState<"Income" | "Expense">("Income")
  const [selectedTransaction, setSelectedTransaction] =
    useState<V2TransactionType | null>(null)

  const resetSelectedDate = () => {
    setSelectedDate(new Date())
  }

  const loadTransactions = async () => {
    const year = selectedDate.getFullYear()
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0")

    const currMonthYear = `${year}-${month}`
    const nextMonthYear = getNextMonthYear({
      isoString: `${currMonthYear}-01`,
    })

    const transactions = await getTransactionsV2({
      filters: [
        {
          column: "transaction_date",
          operator: "gte",
          value: `${currMonthYear}-01`,
        },
        {
          column: "transaction_date",
          operator: "lt",
          value: `${nextMonthYear}-01`,
        },
      ],
    })

    setCurrentMonthTransactions(transactions ?? [])
  }

  useEffect(() => {
    loadTransactions()
  }, [selectedDate])

  return (
    <Stack direction={"column"}>
      <MonthYearSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        resetSelectedDate={resetSelectedDate}
        showMonth={true}
      />

      <TransactionsDisplay
        transactions={currentMonthTransactions}
        accounts={accounts}
        merchants={merchants}
        refreshTransactions={loadTransactions}
        type={type}
        setType={setType}
        selectedDate={selectedDate}
        setAlertToast={setAlertToast}
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={setSelectedTransaction}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        categories={categories}
      />

      {/* <AddEditDialog
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
        type={type}
        setType={setType}
      /> */}

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
