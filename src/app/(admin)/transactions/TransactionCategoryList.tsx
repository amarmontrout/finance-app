import {
  V2CategoryType,
  V2MerchantType,
  V2TransactionType,
} from "@/api/v2/models"
import ListItemSwipe from "@/global/components/ListItemSwipe"
import { numberToString } from "@/global/formattingFunctions"
import { useUser } from "@/hooks/use-user"
import { AlertToastType, HookSetter } from "@/types/types"
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined"
import { Divider, Stack } from "@mui/material"
import { useMemo } from "react"

const TransactionCategoryList = ({
  sortedTransactions,
  selectedTransaction,
  setSelectedTransaction,
  refreshTransactions,
  openDialog,
  setOpenDialog,
  setAlertToast,
  merchants,
  categories,
}: {
  sortedTransactions: V2TransactionType[]
  selectedTransaction: V2TransactionType | null
  setSelectedTransaction: HookSetter<V2TransactionType | null>
  refreshTransactions: () => Promise<void>
  openDialog: boolean
  setOpenDialog: HookSetter<boolean>
  setAlertToast: HookSetter<AlertToastType | undefined>
  merchants: V2MerchantType[]
  categories: V2CategoryType[]
}) => {
  const user = useUser()

  const merchantMap = useMemo(
    () => new Map(merchants.map((m) => [m.merchant_id, m])),
    [merchants],
  )

  const categoriesMap = useMemo(
    () => new Map(categories.map((c) => [c.category_id, c])),
    [categories],
  )

  const showToast = (severity: "success" | "error", message: string) =>
    setAlertToast({
      open: true,
      severity,
      message,
      onClose: () => setAlertToast(undefined),
    })

  const handleDeleteTransaction = async (transaction: V2TransactionType) => {
    if (!user || !transaction) return

    try {
      // await softDeleteTransaction({
      //   userId: user.id,
      //   transactionId: transaction.id,
      // })
      showToast("success", "Transaction deleted successfully!")
    } catch {
      showToast("error", "Transaction could not be deleted.")
    } finally {
      refreshTransactions()
      setSelectedTransaction(null)
    }
  }

  return (
    <Stack
      divider={
        <Divider orientation={"horizontal"} sx={{ borderColor: "#F5F1E8" }} />
      }
    >
      {sortedTransactions.map((transaction, index) => {
        const mainTitle =
          merchantMap.get(transaction.merchant_id)?.name ?? "No Merchant"
        const transactionSign =
          categoriesMap.get(transaction.category_id)
            ?.default_transaction_type === "Return" ||
          transaction.transaction_type === "Income"
            ? "+"
            : "-"
        const transactionAmount = `$${numberToString(transaction.amount)}`
        const buttonCondition = false

        return (
          <ListItemSwipe
            key={transaction.transaction_id}
            icon={
              transaction.transaction_type === "Expense" &&
              categoriesMap.get(transaction.category_id)
                ?.default_transaction_type !== "Return" &&
              !transaction.is_paid && <WarningAmberOutlinedIcon />
            }
            mainTitle={mainTitle}
            secondaryTitle={
              categoriesMap.get(transaction.category_id)?.name ?? "No Category"
            }
            secondaryTitleColor={
              categoriesMap.get(transaction.category_id)?.color
            }
            amount={`${transactionSign}${transactionAmount}`}
            amountColor={"#F5F1E8"}
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
