"use client"

import { V2TransactionType } from "@/api/v2/models"
import { getTransactionsV2 } from "@/api/v2/requests"
import AddDataButton from "@/global/components/AddDataButton"
import AddEditDialog from "@/global/components/AddEditDialog"
import AlertToast from "@/global/components/AlertToast"
import MonthYearSelector from "@/global/components/MonthYearSelector"
import { getMonthRange } from "@/global/formattingFunctions"
import { AlertToastType } from "@/types/types"
import { Stack } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import TransactionsDisplay from "./TransactionsDisplay"

const Transactions = () => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [currTransactions, setCurrTransactions] = useState<V2TransactionType[]>(
    [],
  )
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [alertToast, setAlertToast] = useState<AlertToastType>()
  const [displayType, setDisplayType] = useState<"Income" | "Expense">("Income")
  const [selectedTransaction, setSelectedTransaction] =
    useState<V2TransactionType | null>(null)

  const refreshTransactions = async () => {
    const { startDate, endDate } = getMonthRange({ currentDate: selectedDate })
    const transactions = await getTransactionsV2({
      filters: [
        { column: "transaction_date", operator: "gte", value: startDate },
        { column: "transaction_date", operator: "lt", value: endDate },
        { column: "deleted_at", operator: "eq", value: null },
      ],
    })
    setCurrTransactions(transactions ?? [])
  }

  useEffect(() => {
    refreshTransactions()
  }, [selectedDate])

  return (
    <Stack direction={"column"}>
      <MonthYearSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        resetSelectedDate={() => {
          setSelectedDate(new Date())
        }}
        showMonth={true}
      />

      <TransactionsDisplay
        currTransactions={currTransactions}
        refreshTransactions={refreshTransactions}
        displayType={displayType}
        setDisplayType={setDisplayType}
        setAlertToast={setAlertToast}
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={setSelectedTransaction}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />

      <AddEditDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        setAlertToast={setAlertToast}
        inputRef={inputRef}
        refreshTransactions={refreshTransactions}
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={setSelectedTransaction}
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
