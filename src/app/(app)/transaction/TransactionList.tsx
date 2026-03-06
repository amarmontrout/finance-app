import {
  AlertToastType,
  HookSetter,
  SelectedTransactionType,
  TransactionTypeV2,
} from "@/utils/type"
import { Box, Collapse, Stack, Typography } from "@mui/material"
import { deleteExpense, deleteIncome } from "@/app/api/Transactions/requests"
import { User } from "@supabase/supabase-js"
import ListItemSwipe from "@/components/ListItemSwipe"
import { formattedStringNumber } from "@/utils/helperFunctions"
import { accentColorPrimarySelected } from "@/globals/colors"
import { useMemo } from "react"
import LoadingCircle from "@/components/LoadingCircle"
import { TransitionGroup } from "react-transition-group"

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
  setAlertToast,
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
  setAlertToast: HookSetter<AlertToastType | undefined>
}) => {
  const handleDeleteTransaction = async (
    id: number,
    type: "income" | "expense",
  ) => {
    if (!user) return
    const deleteFn = type === "income" ? deleteIncome : deleteExpense
    const refreshFn =
      type === "income"
        ? refreshIncomeTransactionsV2
        : refreshExpenseTransactionsV2

    try {
      await deleteFn({ userId: user.id, rowId: id })
      setAlertToast({
        open: true,
        onClose: () => {
          setAlertToast(undefined)
        },
        severity: "success",
        message: "Transaction deleted successfully!",
      })
    } catch (error) {
      console.error(error)
      setAlertToast({
        open: true,
        onClose: () => {
          setAlertToast(undefined)
        },
        severity: "error",
        message: "Transaction could not be deleted.",
      })
    } finally {
      refreshFn()
      setSelectedTransaction(null)
    }
  }

  const total = useMemo(() => {
    return transactions.reduce((sum, t) => sum + t.amount, 0)
  }, [transactions])

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) =>
      a.category.localeCompare(b.category, undefined, { sensitivity: "base" }),
    )
  }, [transactions])

  if (isLoading) {
    return <LoadingCircle />
  }

  return (
    <Stack spacing={1.5}>
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

      {sortedTransactions.length === 0 ? (
        <Typography
          width={"100%"}
          textAlign={"center"}
        >{`There are no ${type} transactions`}</Typography>
      ) : (
        <TransitionGroup>
          {sortedTransactions.map((transaction, index) => {
            const isLast = index === sortedTransactions.length - 1
            return (
              <Collapse key={transaction.id}>
                <Box mb={isLast ? 0 : 1}>
                  <ListItemSwipe
                    mainTitle={transaction.category}
                    secondaryTitle={transaction.isPaid ? "Paid" : ""}
                    amount={`$${formattedStringNumber(transaction.amount)}`}
                    amountColor={
                      type === "income" ? "success.main" : "error.main"
                    }
                    buttonCondition={
                      selectedTransaction?.id === transaction.id &&
                      !openEditDialog
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
                </Box>
              </Collapse>
            )
          })}
        </TransitionGroup>
      )}
    </Stack>
  )
}

export default TransactionList
