import { TransactionType } from "@/api/transactions/models"
import { dateTypeToTimestamp } from "@/global/formattingFunctions"
import { AlertToastType, HookSetter } from "@/types/types"
import { Stack } from "@mui/material"
import { useMemo } from "react"
import TransactionCategoryHeader from "./TransactionCategoryHeader"
import TransactionCategoryList from "./TransactionCategoryList"

const TransactionCategoryStack = ({
  filteredTransactions,
  selectedTransaction,
  setSelectedTransaction,
  refreshTransactions,
  openDialog,
  setOpenDialog,
  setAlertToast,
}: {
  filteredTransactions: TransactionType[]
  selectedTransaction: TransactionType | null
  setSelectedTransaction: HookSetter<TransactionType | null>
  refreshTransactions: () => Promise<void>
  openDialog: boolean
  setOpenDialog: HookSetter<boolean>
  setAlertToast: HookSetter<AlertToastType | undefined>
}) => {
  const groupedTransactions = useMemo(() => {
    return filteredTransactions.reduce<Record<number, TransactionType[]>>(
      (acc, transaction) => {
        const timestamp = dateTypeToTimestamp(transaction.date)
        if (!acc[timestamp]) acc[timestamp] = []
        acc[timestamp].push(transaction)
        return acc
      },
      {},
    )
  }, [filteredTransactions])

  const sortedDates = useMemo(() => {
    return Object.entries(groupedTransactions).sort(
      ([a], [b]) => Number(b) - Number(a),
    )
  }, [groupedTransactions])

  return (
    <Stack direction={"column"}>
      {sortedDates.map(([timestamp, transactions]) => {
        const sortedTransactions = [...transactions].sort((a, b) =>
          a.note.localeCompare(b.note),
        )

        return (
          <Stack key={timestamp} direction={"column"} spacing={0.5}>
            <TransactionCategoryHeader
              transactions={transactions}
              timestamp={Number(timestamp)}
            />

            <TransactionCategoryList
              sortedTransactions={sortedTransactions}
              selectedTransaction={selectedTransaction}
              setSelectedTransaction={setSelectedTransaction}
              refreshTransactions={refreshTransactions}
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              setAlertToast={setAlertToast}
            />
          </Stack>
        )
      })}
    </Stack>
  )
}

export default TransactionCategoryStack
