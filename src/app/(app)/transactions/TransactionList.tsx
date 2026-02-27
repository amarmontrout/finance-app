import { formattedStringNumber } from "@/utils/helperFunctions"
import {
  HookSetter,
  SelectedTransactionType,
  TransactionTypeV2,
} from "@/utils/type"
import { Stack, Typography, Box, IconButton } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import CancelIcon from "@mui/icons-material/Cancel"
import EditIcon from "@mui/icons-material/Edit"
import { deleteExpense, deleteIncome } from "@/app/api/Transactions/requests"
import { User } from "@supabase/supabase-js"
import TransactionRow from "./TransactionRow"

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
    <Stack direction={"row"} gap={2} sx={{ flexShrink: 0 }}>
      <IconButton
        size="small"
        onClick={() => {
          setOpenEditDialog(true)
          setSelectedTransaction({ id: id, type: type })
        }}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => {
          setSelectedTransaction({ id: id, type: type })
        }}
      >
        <DeleteIcon fontSize="small" />
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
        size="small"
        onClick={() => {
          handleDeleteTransaction(id, type)
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => {
          setSelectedTransaction(null)
        }}
      >
        <CancelIcon fontSize="small" />
      </IconButton>
    </Stack>
  )
}

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
  selectedMonth,
  selectedYear,
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
  selectedMonth: string
  selectedYear: number
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
        {/* {transactions.map((transaction) => {
          return (
            <Box
              key={transaction.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
                py: 1.5,
                borderRadius: 2,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack>
                <Typography fontWeight={700}>{transaction.category}</Typography>
                <Typography fontSize={12} color="text.secondary">
                  {selectedMonth} {selectedYear}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography
                  fontSize={"1.2rem"}
                  color={type === "income" ? "success.main" : "error.main"}
                >
                  ${formattedStringNumber(transaction.amount)}
                </Typography>

                {selectedTransaction?.id === transaction.id &&
                !openEditDialog ? (
                  <ConfirmCancelButton
                    id={transaction.id}
                    type={type}
                    handleDeleteTransaction={handleDeleteTransaction}
                    setSelectedTransaction={setSelectedTransaction}
                  />
                ) : (
                  <EditDeleteButton
                    id={transaction.id}
                    type={type}
                    setOpenEditDialog={setOpenEditDialog}
                    setSelectedTransaction={setSelectedTransaction}
                  />
                )}
              </Stack>
            </Box>
          )
        })} */}
        {transactions.map((transaction) => (
          <TransactionRow
            key={transaction.id}
            transaction={transaction}
            type={type}
            selectedTransaction={selectedTransaction}
            setSelectedTransaction={setSelectedTransaction}
            openEditDialog={openEditDialog}
            setOpenEditDialog={setOpenEditDialog}
            handleDeleteTransaction={handleDeleteTransaction}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        ))}
      </Stack>
    </Stack>
  )
}

export default TransactionList
