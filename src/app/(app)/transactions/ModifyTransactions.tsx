import { deleteExpense, deleteIncome } from "@/app/api/Transactions/requests"
import ShowCaseCard from "@/components/ShowCaseCard"
import { darkMode, lightMode } from "@/globals/colors"
import { useUser } from "@/hooks/useUser"
import { formattedStringNumber } from "@/utils/helperFunctions"
import {
  Stack,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import CancelIcon from "@mui/icons-material/Cancel"
import EditIcon from "@mui/icons-material/Edit"
import {
  HookSetter,
  SelectedTransactionType,
  TransactionTypeV2,
} from "@/utils/type"

const ModifyTransactions = ({
  currentTheme,
  selectedTransaction,
  setSelectedTransaction,
  refreshIncomeTransactionsV2,
  refreshExpenseTransactionsV2,
  setOpenEditDialog,
  selectedMonth,
  selectedYear,
  incomeTransactionsV2,
  expenseTransactionsV2,
}: {
  currentTheme: string | undefined
  selectedTransaction: SelectedTransactionType | null
  setSelectedTransaction: HookSetter<SelectedTransactionType | null>
  refreshIncomeTransactionsV2: () => void
  refreshExpenseTransactionsV2: () => void
  setOpenEditDialog: HookSetter<boolean>
  selectedMonth: string
  selectedYear: number
  incomeTransactionsV2: TransactionTypeV2[]
  expenseTransactionsV2: TransactionTypeV2[]
}) => {
  const user = useUser()

  const listItemColor =
    currentTheme === "light" ? lightMode.elevatedBg : darkMode.elevatedBg

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
      <ShowCaseCard title={"Income"}>
        {
          <List className="flex flex-col gap-2">
            {incomeTransactionsV2.map((details) => {
              if (
                details.year !== selectedYear ||
                details.month !== selectedMonth
              )
                return
              return (
                <ListItem
                  key={details.id}
                  secondaryAction={
                    selectedTransaction?.id === details.id ? (
                      <ConfirmCancel id={details.id} />
                    ) : (
                      <EditDeleteButton
                        id={details.id}
                        transactionType={"income"}
                      />
                    )
                  }
                  sx={{
                    backgroundColor: listItemColor,
                    borderRadius: "15px",
                    minWidth: "fit-content",
                  }}
                >
                  <ListItemText
                    primary={`$${formattedStringNumber(details.amount)}`}
                    secondary={details.category}
                  />
                </ListItem>
              )
            })}
          </List>
        }
      </ShowCaseCard>

      <ShowCaseCard title={"Expenses"}>
        {
          <List className="flex flex-col gap-2">
            {expenseTransactionsV2.map((details) => {
              if (
                details.year !== selectedYear ||
                details.month !== selectedMonth
              )
                return
              return (
                <ListItem
                  key={details.id}
                  secondaryAction={
                    selectedTransaction?.id === details.id ? (
                      <ConfirmCancel id={details.id} />
                    ) : (
                      <EditDeleteButton
                        id={details.id}
                        transactionType={"expenses"}
                      />
                    )
                  }
                  sx={{
                    backgroundColor: listItemColor,
                    borderRadius: "15px",
                    minWidth: "fit-content",
                  }}
                >
                  <ListItemText
                    primary={`$${formattedStringNumber(details.amount)}`}
                    secondary={details.category}
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

export default ModifyTransactions
