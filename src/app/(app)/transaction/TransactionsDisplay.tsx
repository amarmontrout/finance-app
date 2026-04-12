import LoadingCircle from "@/components/LoadingCircle"
import { formattedStringNumber } from "@/utils/helperFunctions"
import { Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import TransactionTypeToggle from "../../../components/TransactionTypeToggle"
import {
  AlertToastType,
  HookSetter,
  TransactionType,
  SelectedDateType,
} from "@/utils/type"
import ExpenseViewToggle from "./ExpenseViewToggle"
import CategoryStack from "./CategoryStack"

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
  currentTheme,
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
  currentTheme: string | undefined
}) => {
  const [view, setView] = useState<"Credit" | "Debit" | "Both">("Debit")

  const { filteredTransactions, total } = useMemo(() => {
    const filtered = transactions.filter((t) => {
      const matchesType = t.type === type
      const matchesMonth = t.date.month === selectedDate.month
      const matchesYear = t.date.year === selectedDate.year

      const matchesView =
        type === "expense"
          ? view === "Both" ||
            (view === "Debit" && t.payment_method === "Debit") ||
            (view === "Credit" && t.payment_method === "Credit")
          : true

      return matchesType && matchesMonth && matchesYear && matchesView
    })
    const totalAmount = filtered.reduce((sum, t) => {
      return sum + (t.is_return ? -t.amount : t.amount)
    }, 0)
    return { filteredTransactions: filtered, total: totalAmount }
  }, [transactions, type, selectedDate, view])

  useEffect(() => {
    setView("Debit")
  }, [type])

  return (
    <Stack className="xl:w-[50%]" spacing={2} margin={"0 auto"} pb={"58px"}>
      <TransactionTypeToggle type={type} setType={setType} />

      {isLoading ? (
        <LoadingCircle height={250} />
      ) : (
        <Stack spacing={1}>
          {type === "expense" && (
            <ExpenseViewToggle view={view} setView={setView} />
          )}

          <Typography variant="h5" fontWeight={700} textAlign={"center"}>
            {`$${formattedStringNumber(total)}`}
          </Typography>

          {filteredTransactions.length === 0 ? (
            <Typography width="100%" textAlign="center">
              {`There are no ${type} transactions`}
            </Typography>
          ) : (
            <CategoryStack
              filteredTransactions={filteredTransactions}
              selectedTransaction={selectedTransaction}
              setSelectedTransaction={setSelectedTransaction}
              refreshTransactions={refreshTransactions}
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              setAlertToast={setAlertToast}
              currentTheme={currentTheme}
            />
          )}
        </Stack>
      )}
    </Stack>
  )
}

export default TransactionsDisplay
