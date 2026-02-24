"use client"

import { deleteIncome, deleteExpense } from "@/app/api/Transactions/requests"
import ShowCaseCard from "@/components/ShowCaseCard"
import { useTransactionContext } from "@/contexts/transactions-context"
import { formattedStringNumber, getCardColor } from "@/utils/helperFunctions"
import { IconButton, List, ListItem, ListItemText, Stack } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import CancelIcon from "@mui/icons-material/Cancel"
import EditIcon from "@mui/icons-material/Edit"
import { useUser } from "@/hooks/useUser"
import { HookSetter, SelectedTransactionType } from "@/utils/type"

const TransactionFeed = ({
  selectedMonth,
  selectedYear,
  currentTheme,
  selectedTransaction,
  setSelectedTransaction,
  setOpenEditDialog,
}: {
  selectedMonth: string
  selectedYear: number
  currentTheme: string | undefined
  selectedTransaction: SelectedTransactionType | null
  setSelectedTransaction: HookSetter<SelectedTransactionType | null>
  setOpenEditDialog: HookSetter<boolean>
}) => {
  const {
    incomeTransactionsV2,
    expenseTransactionsV2,
    refreshIncomeTransactionsV2,
    refreshExpenseTransactionsV2,
  } = useTransactionContext()
  const user = useUser()

  const transactionList = [
    ...incomeTransactionsV2.map((t) => ({ ...t, type: "income" })),
    ...expenseTransactionsV2.map((t) => ({ ...t, type: "expense" })),
  ]

  const sortTransactionsByCategory = (transactions: typeof transactionList) => {
    return [...transactions].sort((a, b) =>
      a.category.localeCompare(b.category),
    )
  }

  const sortedTransactions = sortTransactionsByCategory(transactionList)

  const expenseColor = getCardColor(currentTheme, "concerning")
  const incomeColor = getCardColor(currentTheme, "great")

  const handleDeleteTransaction = async (id: number) => {
    if (!user || !selectedTransaction) return

    if (selectedTransaction.type === "income") {
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

  const EditDeleteButton = ({
    id,
    transactionType,
  }: {
    id: number
    transactionType: "income" | "expenses"
  }) => {
    return (
      <Stack direction={"row"} gap={2}>
        <IconButton
          edge="end"
          onClick={() => {
            setOpenEditDialog(true)
            setSelectedTransaction({ id: id, type: transactionType })
          }}
        >
          <EditIcon />
        </IconButton>

        <IconButton
          edge="end"
          onClick={() => {
            setSelectedTransaction({ id: id, type: transactionType })
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    )
  }

  const ConfirmCancel = ({ id }: { id: number }) => {
    return (
      <Stack direction={"row"} gap={2}>
        <IconButton
          edge="end"
          onClick={() => {
            if (!selectedYear || !selectedMonth) return
            handleDeleteTransaction(id)
          }}
        >
          <DeleteIcon />
        </IconButton>

        <IconButton
          edge="end"
          onClick={() => {
            setSelectedTransaction(null)
          }}
        >
          <CancelIcon />
        </IconButton>
      </Stack>
    )
  }

  return (
    <Stack direction={"column"} spacing={2}>
      <ShowCaseCard title={""}>
        {
          <List className="flex flex-col gap-2">
            {sortedTransactions.map((transaction) => {
              if (
                transaction.year !== selectedYear ||
                transaction.month !== selectedMonth
              )
                return
              return (
                <ListItem
                  key={transaction.id}
                  secondaryAction={
                    selectedTransaction?.id === transaction.id ? (
                      <ConfirmCancel id={transaction.id} />
                    ) : (
                      <EditDeleteButton
                        id={transaction.id}
                        transactionType={
                          transaction.type as "income" | "expenses"
                        }
                      />
                    )
                  }
                  sx={{
                    backgroundColor:
                      transaction.type === "income"
                        ? incomeColor.background
                        : expenseColor.background,
                    border:
                      transaction.type === "income"
                        ? `1px solid ${incomeColor.border}`
                        : `1px solid ${expenseColor.border}`,
                    borderRadius: "15px",
                    minWidth: "fit-content",
                  }}
                >
                  <ListItemText
                    primary={`$${formattedStringNumber(transaction.amount)}`}
                    secondary={transaction.category}
                  />
                </ListItem>
              )
            })}
          </List>
        }
      </ShowCaseCard>
    </Stack>
  )
}

export default TransactionFeed
