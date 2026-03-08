import LoadingCircle from "@/components/LoadingCircle"
import ShowCaseCard from "@/components/ShowCaseCard"
import { formattedStringNumber } from "@/utils/helperFunctions"
import { Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import TransactionTypeToggle from "../../../components/TransactionTypeToggle"
import {
  AlertToastType,
  HookSetter,
  NewTransactionType,
  SelectedDateType,
} from "@/utils/type"
import ExpenseViewToggle from "./ExpenseViewToggle"
import CategoryStack from "./CategoryStack"
import { accentColorPrimary } from "@/globals/colors"

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
  transactions: NewTransactionType[]
  refreshTransactions: () => Promise<void>
  type: "income" | "expense"
  setType: HookSetter<"income" | "expense">
  selectedDate: SelectedDateType
  setAlertToast: HookSetter<AlertToastType | undefined>
  selectedTransaction: NewTransactionType | null
  setSelectedTransaction: HookSetter<NewTransactionType | null>
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
    <ShowCaseCard title={""}>
      <Stack className="xl:w-[50%]" spacing={2} margin={"0 auto"}>
        <TransactionTypeToggle type={type} setType={setType} />

        {isLoading ? (
          <LoadingCircle />
        ) : (
          <Stack spacing={1}>
            {type === "expense" && (
              <ExpenseViewToggle view={view} setView={setView} />
            )}

            <hr
              style={{
                border: `1px solid ${accentColorPrimary}`,
              }}
            />

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
    </ShowCaseCard>
  )
}

export default TransactionsDisplay
