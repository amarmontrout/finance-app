import { V2TransactionType } from "@/api/v2/models"
import { useDataContext } from "@/contexts/data-context"
import ListItemSwipe from "@/global/components/ListItemSwipe"
import { currencyFormatter } from "@/global/formattingFunctions"
import { HookSetter } from "@/types/types"
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined"
import { Divider, Stack } from "@mui/material"
import { useTransactionContext } from "../v2/TransactionsContext"

const TransactionList = ({
  sortedTransactions,
  setOpenDialog,
}: {
  sortedTransactions: V2TransactionType[]
  setOpenDialog: HookSetter<boolean>
}) => {
  const { merchantMap, categoryMap } = useDataContext()
  const { setSelectedTransaction, deleteTransaction } = useTransactionContext()

  return (
    <Stack
      divider={
        <Divider orientation={"horizontal"} sx={{ borderColor: "#F5F1E8" }} />
      }
    >
      {sortedTransactions.map((transaction, index) => {
        const mainTitle =
          merchantMap.get(transaction.merchant_id!)?.name ?? "No Merchant"
        const transactionAmount = currencyFormatter.format(transaction.amount)
        const buttonCondition = false

        return (
          <ListItemSwipe
            key={transaction.transaction_id}
            icon={
              transaction.transaction_type === "Expense" &&
              categoryMap.get(transaction.category_id!)
                ?.default_transaction_type !== "Return" &&
              !transaction.is_paid && <WarningAmberOutlinedIcon />
            }
            mainTitle={mainTitle}
            secondaryTitle={
              categoryMap.get(transaction.category_id!)?.name ?? "No Category"
            }
            secondaryTitleColor={
              categoryMap.get(transaction.category_id!)?.color
            }
            amount={transactionAmount}
            amountColor={"#F5F1E8"}
            buttonCondition={buttonCondition}
            onDelete={() => deleteTransaction(transaction)}
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

export default TransactionList
