"use client"

import { deleteIncome, deleteExpense } from "@/app/api/Transactions/requests"
import ShowCaseCard from "@/components/ShowCaseCard"
import { useTransactionContext } from "@/contexts/transactions-context"
import { formattedStringNumber, getCardColor } from "@/utils/helperFunctions"
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import CancelIcon from "@mui/icons-material/Cancel"
import EditIcon from "@mui/icons-material/Edit"
import { useUser } from "@/hooks/useUser"
import { HookSetter, SelectedTransactionType } from "@/utils/type"
import { useMemo } from "react"

const EditDeleteButton = ({
  id,
  type,
  setOpenEditDialog,
  setSelectedTransaction,
}: {
  id: number
  type: "income" | "expense"
  setOpenEditDialog: HookSetter<boolean>
  setSelectedTransaction: HookSetter<SelectedTransactionType | null>
}) => {
  return (
    <Stack direction={"row"} gap={2}>
      <IconButton
        edge="end"
        onClick={() => {
          setOpenEditDialog(true)
          setSelectedTransaction({ id: id, type: type })
        }}
      >
        <EditIcon />
      </IconButton>
      <IconButton
        edge="end"
        onClick={() => {
          setSelectedTransaction({ id: id, type: type })
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Stack>
  )
}

const ConfirmCancelButton = ({
  id,
  type,
  handleDeleteTransaction,
  setSelectedTransaction,
}: {
  id: number
  type: "income" | "expense"
  handleDeleteTransaction: (
    id: number,
    type: "income" | "expense",
  ) => Promise<void>
  setSelectedTransaction: HookSetter<SelectedTransactionType | null>
}) => {
  return (
    <Stack direction={"row"} gap={2}>
      <IconButton
        edge="end"
        onClick={() => {
          handleDeleteTransaction(id, type)
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

const TransactionFeed = ({
  selectedMonth,
  selectedYear,
  currentTheme,
  selectedTransaction,
  setSelectedTransaction,
  openEditDialog,
  setOpenEditDialog,
}: {
  selectedMonth: string
  selectedYear: number
  currentTheme: string | undefined
  selectedTransaction: SelectedTransactionType | null
  setSelectedTransaction: HookSetter<SelectedTransactionType | null>
  openEditDialog: boolean
  setOpenEditDialog: HookSetter<boolean>
}) => {
  const {
    incomeTransactionsV2,
    expenseTransactionsV2,
    refreshIncomeTransactionsV2,
    refreshExpenseTransactionsV2,
  } = useTransactionContext()
  const user = useUser()

  const transactions = useMemo(() => {
    const filteredIncome = incomeTransactionsV2
      .filter((t) => t.year === selectedYear && t.month === selectedMonth)
      .map((t) => ({ ...t, type: "income" as const }))

    const filteredExpense = expenseTransactionsV2
      .filter((t) => t.year === selectedYear && t.month === selectedMonth)
      .map((t) => ({ ...t, type: "expense" as const }))

    return [...filteredIncome, ...filteredExpense].sort((a, b) =>
      a.category.localeCompare(b.category),
    )
  }, [incomeTransactionsV2, expenseTransactionsV2, selectedYear, selectedMonth])

  const expenseColor = getCardColor(currentTheme, "concerning")
  const incomeColor = getCardColor(currentTheme, "great")

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
    <Stack direction={"column"} spacing={2}>
      <ShowCaseCard title={""}>
        {
          <List className="flex flex-col gap-2">
            {transactions.map((transaction) => {
              if (
                transaction.year !== selectedYear ||
                transaction.month !== selectedMonth
              )
                return null
              return (
                <ListItem
                  key={transaction.id}
                  secondaryAction={
                    selectedTransaction?.id === transaction.id &&
                    !openEditDialog ? (
                      <ConfirmCancelButton
                        id={transaction.id}
                        type={transaction.type as "income" | "expense"}
                        handleDeleteTransaction={handleDeleteTransaction}
                        setSelectedTransaction={setSelectedTransaction}
                      />
                    ) : (
                      <EditDeleteButton
                        id={transaction.id}
                        type={transaction.type as "income" | "expense"}
                        setOpenEditDialog={setOpenEditDialog}
                        setSelectedTransaction={setSelectedTransaction}
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
                  <ListItemText>
                    <Stack
                      direction={"row"}
                      width={"200px"}
                      justifyContent={"space-between"}
                    >
                      <Box>{`${transaction.category}`}</Box>
                      <Box>{`$${formattedStringNumber(transaction.amount)}`}</Box>
                    </Stack>
                  </ListItemText>
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
