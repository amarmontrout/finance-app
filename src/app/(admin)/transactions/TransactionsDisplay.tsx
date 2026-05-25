import { TransactionType } from "@/api/transactions/models"
import LoadingCircle from "@/global/components/LoadingCircle"
import { getTransactionsTotal } from "@/global/dataFunctions"
import { numberToString } from "@/global/formattingFunctions"
import { AlertToastType, HookSetter, SelectedDateType } from "@/types/types"
import { Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import ExpenseViewToggle from "./_components/ExpenseViewToggle"
import TransactionTypeToggle from "./_components/TransactionTypeToggle"
import TransactionCategoryStack from "./TransactionCategoryStack"

const TransactionsDisplay = ({
  transactions,
  refreshTransactions,
  type,
  setType,
  selectedDate,
  setAlertToast,
  selectedTransaction,
  setSelectedTransaction,
  isLoading,
  openDialog,
  setOpenDialog,
}: {
  transactions: TransactionType[]
  refreshTransactions: () => Promise<void>
  type: "income" | "expense"
  setType: HookSetter<"income" | "expense">
  selectedDate: SelectedDateType
  setAlertToast: HookSetter<AlertToastType | undefined>
  selectedTransaction: TransactionType | null
  setSelectedTransaction: HookSetter<TransactionType | null>
  isLoading: boolean
  openDialog: boolean
  setOpenDialog: HookSetter<boolean>
}) => {
  const [view, setView] = useState<"Credit" | "Debit" | "Both">("Debit")

  const { filteredTransactions, total } = useMemo(() => {
    const filtered = transactions.filter((t) => {
      const matchesType = t.type === type
      const matchesView =
        type === "expense"
          ? view === "Both" ||
            (view === "Debit" && t.payment_method === "Debit") ||
            (view === "Credit" && t.payment_method === "Credit")
          : true
      return matchesType && matchesView
    })

    const totalAmount = getTransactionsTotal({ transactions: filtered })

    return { filteredTransactions: filtered, total: totalAmount }
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
        <Typography variant={"h5"} sx={{ fontWeight: 700 }}>
          {`$${numberToString(total)}`}
        </Typography>

        {type === "expense" && (
          <ExpenseViewToggle view={view} setView={setView} />
        )}
      </Stack>

      {isLoading ? (
        <LoadingCircle height={75} />
      ) : filteredTransactions.length === 0 ? (
        <Typography sx={{ width: "100%", textAlign: "center" }}>
          {`There are no ${type} transactions`}
        </Typography>
      ) : (
        <TransactionCategoryStack
          filteredTransactions={filteredTransactions}
          selectedTransaction={selectedTransaction}
          setSelectedTransaction={setSelectedTransaction}
          refreshTransactions={refreshTransactions}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          setAlertToast={setAlertToast}
        />
      )}
    </Stack>
  )
}

export default TransactionsDisplay
