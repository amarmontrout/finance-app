import { TransactionType } from "@/api/transactions/models"
import { softDeleteTransaction } from "@/api/transactions/requests"
import { negativeColor, neutralColor, positiveColor } from "@/global/colors"
import ListItemSwipe from "@/global/components/ListItemSwipe"
import { numberToString } from "@/global/formattingFunctions"
import { useUser } from "@/hooks/use-user"
import { AlertToastType, HookSetter } from "@/types/types"
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined"
import { Divider, Stack } from "@mui/material"

const TransactionCategoryList = ({
  sortedTransactions,
  selectedTransaction,
  setSelectedTransaction,
  refreshTransactions,
  refreshDeletedTransactions,
  openDialog,
  setOpenDialog,
  setAlertToast,
}: {
  sortedTransactions: TransactionType[]
  selectedTransaction: TransactionType | null
  setSelectedTransaction: HookSetter<TransactionType | null>
  refreshTransactions: () => Promise<void>
  refreshDeletedTransactions: () => Promise<void>
  openDialog: boolean
  setOpenDialog: HookSetter<boolean>
  setAlertToast: HookSetter<AlertToastType | undefined>
}) => {
  const user = useUser()

  const showToast = (severity: "success" | "error", message: string) =>
    setAlertToast({
      open: true,
      severity,
      message,
      onClose: () => setAlertToast(undefined),
    })

  const handleDeleteTransaction = async (transaction: TransactionType) => {
    if (!user || !transaction) return

    try {
      await softDeleteTransaction({
        userId: user.id,
        transactionId: transaction.id,
      })
      showToast("success", "Transaction deleted successfully!")
    } catch {
      showToast("error", "Transaction could not be deleted.")
    } finally {
      refreshTransactions()
      refreshDeletedTransactions()
      setSelectedTransaction(null)
    }
  }

  return (
    <Stack
      divider={
        <Divider
          orientation={"horizontal"}
          sx={{ borderColor: neutralColor.bg }}
        />
      }
    >
      {sortedTransactions.map((transaction, index) => {
        const mainTitle =
          transaction.note === "" ? transaction.category : transaction.note
        const transactionSign =
          transaction.is_return || transaction.type === "income" ? "+" : "-"
        const transactionAmount = `$${numberToString(transaction.amount)}`
        const amountColor =
          transaction.type === "income" || transaction.is_return
            ? positiveColor.color
            : negativeColor.color
        const buttonCondition =
          selectedTransaction?.id === transaction.id && !openDialog

        return (
          <ListItemSwipe
            key={transaction.id}
            icon={
              transaction.type === "expense" &&
              !transaction.is_return &&
              !transaction.is_paid && <WarningAmberOutlinedIcon />
            }
            mainTitle={mainTitle}
            secondaryTitle={transaction.category}
            amount={`${transactionSign}${transactionAmount}`}
            amountColor={amountColor}
            buttonCondition={buttonCondition}
            onDelete={() => handleDeleteTransaction(transaction)}
            onSetDelete={() => setSelectedTransaction(transaction)}
            onCancelDelete={() => setSelectedTransaction(null)}
            onEdit={() => {
              setOpenDialog(true)
              setSelectedTransaction(transaction)
            }}
          />
        )
      })}
    </Stack>
  )
}

export default TransactionCategoryList
