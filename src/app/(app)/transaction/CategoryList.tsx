import { deleteTransaction } from "@/app/api/Transactions/requests"
import ListItemSwipe from "@/components/ListItemSwipe"
import { positiveColor, negativeColor } from "@/globals/colors"
import { useUser } from "@/hooks/useUser"
import { formattedStringNumber } from "@/utils/helperFunctions"
import { AlertToastType, HookSetter, NewTransactionType } from "@/utils/type"
import { Stack, Collapse, Box } from "@mui/material"
import { TransitionGroup } from "react-transition-group"

const CategoryList = ({
  sortedEntries,
  selectedTransaction,
  setSelectedTransaction,
  refreshTransactions,
  openDialog,
  setOpenDialog,
  setAlertToast,
  isExpanded,
  currentTheme,
}: {
  sortedEntries: NewTransactionType[]
  selectedTransaction: NewTransactionType | null
  setSelectedTransaction: HookSetter<NewTransactionType | null>
  refreshTransactions: () => Promise<void>
  openDialog: boolean
  setOpenDialog: HookSetter<boolean>
  setAlertToast: HookSetter<AlertToastType | undefined>
  isExpanded: boolean
  currentTheme: string | undefined
}) => {
  const user = useUser()

  const visibleEntries =
    sortedEntries.length > 2 && !isExpanded
      ? sortedEntries.slice(0, 2)
      : sortedEntries

  const showToast = (severity: "success" | "error", message: string) =>
    setAlertToast({
      open: true,
      severity,
      message,
      onClose: () => setAlertToast(undefined),
    })

  const handleDeleteTransaction = async (rowId: number) => {
    if (!user || !rowId) return

    try {
      await deleteTransaction({ userId: user.id, rowId })
      showToast("success", "Transaction deleted successfully!")
    } catch {
      showToast("error", "Transaction could not be deleted.")
    } finally {
      refreshTransactions()
      setSelectedTransaction(null)
    }
  }

  return (
    <Stack px={0.5}>
      <TransitionGroup>
        {visibleEntries.map((transaction, index) => {
          const transactionDate = `${transaction.date.month} ${transaction.date.day}, ${transaction.date.year}`
          const isLast = index === visibleEntries.length - 1

          return (
            <Collapse key={transaction.id}>
              <Box mb={isLast ? 0 : 1}>
                <ListItemSwipe
                  mainTitle={
                    transaction.note === ""
                      ? transaction.category
                      : transaction.note
                  }
                  secondaryTitle={transactionDate}
                  amount={`$${formattedStringNumber(transaction.amount)}`}
                  amountColor={
                    transaction.type === "income"
                      ? positiveColor
                      : negativeColor
                  }
                  buttonCondition={
                    selectedTransaction?.id === transaction.id && !openDialog
                  }
                  onDelete={() => handleDeleteTransaction(transaction.id)}
                  onSetDelete={() => setSelectedTransaction(transaction)}
                  onCancelDelete={() => setSelectedTransaction(null)}
                  onEdit={() => {
                    setOpenDialog(true)
                    setSelectedTransaction(transaction)
                  }}
                  currentTheme={currentTheme}
                />
              </Box>
            </Collapse>
          )
        })}
      </TransitionGroup>
    </Stack>
  )
}

export default CategoryList
