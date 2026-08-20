import {
  V2AccountType,
  V2CategoryType,
  V2MerchantType,
  V2TransactionType,
} from "@/api/v2/models"
import { getTransactionsTotal } from "@/global/dataFunctions"
import { numberToString } from "@/global/formattingFunctions"
import { AlertToastType, HookSetter } from "@/types/types"
import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import ExpenseViewToggle from "./_components/ExpenseViewToggle"
import TransactionTypeToggle from "./_components/TransactionTypeToggle"
import TransactionCategoryStack from "./TransactionCategoryStack"

const TransactionsDisplay = ({
  transactions,
  accounts,
  merchants,
  refreshTransactions,
  type,
  setType,
  selectedDate,
  setAlertToast,
  selectedTransaction,
  setSelectedTransaction,
  openDialog,
  setOpenDialog,
  categories,
}: {
  transactions: V2TransactionType[]
  accounts: V2AccountType[]
  merchants: V2MerchantType[]
  refreshTransactions: () => Promise<void>
  type: "Income" | "Expense"
  setType: HookSetter<"Income" | "Expense">
  selectedDate: Date
  setAlertToast: HookSetter<AlertToastType | undefined>
  selectedTransaction: V2TransactionType | null
  setSelectedTransaction: HookSetter<V2TransactionType | null>
  openDialog: boolean
  setOpenDialog: HookSetter<boolean>
  categories: V2CategoryType[]
}) => {
  const [view, setView] = useState<"Credit" | "Debit" | "Both">("Debit")
  // Account map for transaction payment account
  const accountMap = useMemo(
    () => new Map(accounts.map((a) => [a.account_id, a])),
    [accounts],
  )

  const { transactionsByType, total } = useMemo(() => {
    const filtered = transactions.filter((t) => {
      const matchesType = t.transaction_type === type
      const matchesView =
        type === "Expense"
          ? view === "Both" ||
            (view === "Debit" &&
              accountMap.get(t.account_id)?.type === "Checking") ||
            (view === "Credit" &&
              accountMap.get(t.account_id)?.type === "Credit Card")
          : true
      return matchesType && matchesView
    })

    const totalAmount = getTransactionsTotal({ transactions: filtered })

    return { transactionsByType: filtered, total: totalAmount }
  }, [transactions, type, selectedDate, view])

  useEffect(() => {
    setView("Both")
  }, [type])

  return (
    <Stack className="xl:w-[50%]" spacing={1} sx={{ paddingBottom: "50px" }}>
      <TransactionTypeToggle type={type} setType={setType} />

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

        {type === "Expense" && (
          <ExpenseViewToggle view={view} setView={setView} />
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
            {`There are no ${type} transactions`}
          </Typography>
        ) : (
          <TransactionCategoryStack
            transactionsByType={transactionsByType}
            selectedTransaction={selectedTransaction}
            setSelectedTransaction={setSelectedTransaction}
            refreshTransactions={refreshTransactions}
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            setAlertToast={setAlertToast}
            merchants={merchants}
            categories={categories}
          />
        )}
      </Box>
    </Stack>
  )
}

export default TransactionsDisplay
