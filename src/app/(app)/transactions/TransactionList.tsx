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

  return (
    <Stack>
      <Typography variant={"h5"} mb={"5px"}>
        {title}
      </Typography>

      <Stack spacing={1}>
        {transactions.map((transaction) => (
          <ListItemSwipe
            key={transaction.id}
            mainTitle={transaction.category}
            secondaryTitle={""}
            amount={`${formattedStringNumber(transaction.amount)}`}
            amountColor={type === "income" ? "success.main" : "error.main"}
            buttonCondition={
              selectedTransaction?.id === transaction.id && !openEditDialog
            }
            onDelete={() => {
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
    </Stack>
  )
}

export default TransactionList
