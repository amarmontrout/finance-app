"use client"

import { TransactionTypeValue, V2TransactionType } from "@/api/v2/models"
import { getTransactionsV2 } from "@/api/v2/requests"
import { useDataContext } from "@/contexts/data-context"
import AlertToast from "@/global/components/AlertToast"
import MonthYearSelector from "@/global/components/MonthYearSelector"
import { getTransactionsTotal } from "@/global/dataFunctions"
import { getMonthRange, numberToString } from "@/global/formattingFunctions"
import { AlertToastType } from "@/types/types"
import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import ExpenseViewToggle from "./_components/TransactionExpenseViewToggle"
import TransactionTypeToggle from "./_components/TransactionTypeToggle"
import TransactionCategoryHeader from "./TransactionCategoryHeader"
import TransactionCategoryList from "./TransactionCategoryList"

const TransactionsV2 = () => {
  const { accountMap, categories, merchants, merchantMap } = useDataContext()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [displayType, setDisplayType] =
    useState<Partial<TransactionTypeValue>>("Income")
  const [alertToast, setAlertToast] = useState<AlertToastType>()
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [expenseView, setExpenseView] = useState<"Credit" | "Debit" | "Both">(
    "Debit",
  )
  const [currTransactions, setCurrTransactions] = useState<V2TransactionType[]>(
    [],
  )
  const [selectedTransaction, setSelectedTransaction] =
    useState<V2TransactionType | null>(null)

  const { transactionsByType, total } = useMemo(() => {
    const filtered = currTransactions.filter((t) => {
      const accountType = accountMap.get(t.account_id!)?.type

      const matchesDisplayType =
        displayType === "Income"
          ? ["Income", "Refund", "Return"].includes(t.transaction_type)
          : t.transaction_type === "Expense"

      if (!matchesDisplayType) {
        return false
      }

      // Income/Refund/Return don't need debit/credit filtering
      if (displayType === "Income") {
        return true
      }

      // Expense filtering
      if (expenseView === "Both") {
        return true
      }

      if (expenseView === "Debit") {
        return accountType === "Checking"
      }

      if (expenseView === "Credit") {
        return accountType === "Credit Card"
      }

      return false
    })

    const totalAmount = getTransactionsTotal({
      transactions: filtered,
    })

    return {
      transactionsByType: filtered,
      total: totalAmount,
    }
  }, [currTransactions, displayType, expenseView, accountMap])

  const groupedTransactions = useMemo(() => {
    const grouped = transactionsByType.reduce<
      Record<string, V2TransactionType[]>
    >((acc, transaction) => {
      const date = transaction.transaction_date

      if (!acc[date]) acc[date] = []
      acc[date].push(transaction)

      return acc
    }, {})

    return Object.entries(grouped).sort(([dateA], [dateB]) =>
      dateB.localeCompare(dateA),
    )
  }, [transactionsByType])

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

  useEffect(() => {
    setExpenseView("Both")
  }, [displayType])

  return (
    <Stack>
      <MonthYearSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        showMonth={true}
        showYearButtons={true}
      />

      <Stack spacing={1}>
        <TransactionTypeToggle
          displayType={displayType}
          setDisplayType={setDisplayType}
        />

        {/* Transaction header and expense view toggle */}
        <Stack
          direction={"row"}
          sx={{
            minHeight: 40,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant={"h5"} sx={{ fontWeight: 700, color: "#102A1B" }}>
            {`$${numberToString(total)}`}
          </Typography>

          {displayType === "Expense" && (
            <ExpenseViewToggle
              expenseView={expenseView}
              setExpenseView={setExpenseView}
            />
          )}
        </Stack>

        <Box
          bgcolor={"rgba(255,255,255,0.15)"}
          borderRadius={5}
          minHeight={"150px"}
          padding={2}
        >
          {transactionsByType.length === 0 ? (
            <Typography sx={{ width: "100%", textAlign: "center" }}>
              {`There are no ${displayType} transactions`}
            </Typography>
          ) : (
            <Stack direction={"column"}>
              {groupedTransactions.map(([date, transactions]) => {
                const sortedTransactions = [...transactions].sort((a, b) => {
                  const merchantA = merchantMap.get(a.merchant_id!)?.name ?? ""
                  const merchantB = merchantMap.get(b.merchant_id!)?.name ?? ""

                  return merchantA.localeCompare(merchantB)
                })

                return (
                  <Stack key={date} direction={"column"} spacing={0.5}>
                    <TransactionCategoryHeader
                      transactions={transactions}
                      date={date}
                    />

                    <TransactionCategoryList
                      sortedTransactions={sortedTransactions}
                      selectedTransaction={selectedTransaction}
                      setSelectedTransaction={setSelectedTransaction}
                      refreshTransactions={refreshTransactions}
                      openDialog={openDialog}
                      setOpenDialog={setOpenDialog}
                      setAlertToast={setAlertToast}
                      merchants={merchants}
                      categories={categories}
                    />
                  </Stack>
                )
              })}
            </Stack>
          )}
        </Box>
      </Stack>

      <AlertToast alertToast={alertToast} />
    </Stack>
  )
}

export default TransactionsV2
