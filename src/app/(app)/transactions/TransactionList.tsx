import {
  HookSetter,
  SelectedTransactionType,
  TransactionTypeV2,
} from "@/utils/type"
import { Stack, Typography } from "@mui/material"
import { deleteExpense, deleteIncome } from "@/app/api/Transactions/requests"
import { User } from "@supabase/supabase-js"
import ListItemSwipe from "@/components/ListItemSwipe"
import { formattedStringNumber } from "@/utils/helperFunctions"
import { accentColorPrimarySelected } from "@/globals/colors"
import { useMemo } from "react"
import LoadingCircle from "@/components/LoadingCircle"

const TransactionList = ({
  title,
  transactions,
  type,
  user,
  selectedTransaction,
  setSelectedTransaction,
  openEditDialog,
  setOpenEditDialog,
  refreshIncomeTransactionsV2,
  refreshExpenseTransactionsV2,
  currentTheme,
  isLoading,
}: {
  title: "Income" | "Expense"
  transactions: TransactionTypeV2[]
  type: "income" | "expense"
  user: User | null
  selectedTransaction: SelectedTransactionType | null
  setSelectedTransaction: HookSetter<SelectedTransactionType | null>
  openEditDialog: boolean
  setOpenEditDialog: HookSetter<boolean>
  refreshIncomeTransactionsV2: () => void
  refreshExpenseTransactionsV2: () => void
  currentTheme: string | undefined
  isLoading: boolean
}) => {
  const handleDeleteTransaction = async (
    id: number,
    type: "income" | "expense",
  ) => {
    if (!user) return

    if (type === "income") {
      await deleteIncome({
        userId: user.id,
        rowId: id,
      })
      refreshIncomeTransactionsV2()
    } else {
      await deleteExpense({
        userId: user.id,
        rowId: id,
      })
      refreshExpenseTransactionsV2()
    }

    setSelectedTransaction(null)
  }

  const total = useMemo(() => {
    return transactions.reduce((sum, t) => sum + t.amount, 0)
  }, [transactions])

  if (isLoading) {
    return <LoadingCircle />
  }

  return (
    <Stack spacing={0.5}>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Typography variant={"h5"} fontWeight={700}>
          {title}
        </Typography>

        <Typography variant={"h5"} fontWeight={700}>
          {`$${formattedStringNumber(total)}`}
        </Typography>
      </Stack>

      <hr
        style={{
          border: `1px solid ${accentColorPrimarySelected}`,
        }}
      />

      {transactions.length === 0 ? (
        <Typography
          width={"100%"}
          textAlign={"center"}
        >{`There are no ${type} transactions yet`}</Typography>
      ) : (
        <Stack spacing={1}>
          {transactions.map((transaction) => (
            <ListItemSwipe
              key={transaction.id}
              mainTitle={transaction.category}
              secondaryTitle={""}
              amount={`$${formattedStringNumber(transaction.amount)}`}
              amountColor={type === "income" ? "success.main" : "error.main"}
              buttonCondition={
                selectedTransaction?.id === transaction.id && !openEditDialog
              }
              onDelete={async () => {
                handleDeleteTransaction(transaction.id, type)
              }}
              onSetDelete={() => {
                setSelectedTransaction({ id: transaction.id, type: type })
              }}
              onCancelDelete={() => {
                setSelectedTransaction(null)
              }}
              onEdit={() => {
                setOpenEditDialog(true)
                setSelectedTransaction({ id: transaction.id, type: type })
              }}
              currentTheme={currentTheme}
            />
          ))}
        </Stack>
      )}
    </Stack>
  )
}

export default TransactionList
