import { V2TransactionType } from "@/api/v2/models"
import { useDataContext } from "@/contexts/data-context"
import { getTransactionsTotal } from "@/global/dataFunctions"
import { numberToString } from "@/global/formattingFunctions"
import { AlertToastType, HookSetter } from "@/types/types"
import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import ExpenseViewToggle from "./_components/TransactionExpenseViewToggle"
import TransactionTypeToggle from "./_components/TransactionTypeToggle"
import TransactionCategoryStack from "./TransactionCategoryStack"

const TransactionsDisplay = ({
  currTransactions,
  refreshTransactions,
  displayType,
  setDisplayType,
  setAlertToast,
  selectedTransaction,
  setSelectedTransaction,
  openDialog,
  setOpenDialog,
}: {
  currTransactions: V2TransactionType[]
  refreshTransactions: () => Promise<void>
  displayType: "Income" | "Expense"
  setDisplayType: HookSetter<"Income" | "Expense">
  setAlertToast: HookSetter<AlertToastType | undefined>
  selectedTransaction: V2TransactionType | null
  setSelectedTransaction: HookSetter<V2TransactionType | null>
  openDialog: boolean
  setOpenDialog: HookSetter<boolean>
}) => {
  const { accounts, categories, merchants } = useDataContext()
  const [expenseView, setExpenseView] = useState<"Credit" | "Debit" | "Both">(
    "Debit",
  )
  // Account map for transaction payment account
  const accountMap = useMemo(
    () => new Map(accounts.map((a) => [a.account_id, a])),
    [accounts],
  )

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

  useEffect(() => {
    setExpenseView("Both")
  }, [displayType])

  return (
    <Stack className="xl:w-[50%]" spacing={1} sx={{ paddingBottom: "50px" }}>
      <TransactionTypeToggle
        displayType={displayType}
        setDisplayType={setDisplayType}
      />

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
