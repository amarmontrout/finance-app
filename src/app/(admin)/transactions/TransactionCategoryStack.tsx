import { TransactionType } from "@/api/transactions/models"
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
    return filteredTransactions.reduce<Record<string, TransactionType[]>>(
      (acc, transaction) => {
        const { month, day, year } = transaction.date
        const dateKey = `${year}-${month.padStart(2, "0")}-${String(day).padStart(2, "0")}`
        if (!acc[dateKey]) acc[dateKey] = []
        acc[dateKey].push(transaction)
        return acc
      },
      {},
    )
  }, [filteredTransactions])

  const sortedDates = useMemo(() => {
    return Object.entries(groupedTransactions).sort(
      ([a], [b]) => new Date(b).getTime() - new Date(a).getTime(),
    )
  }, [groupedTransactions])

  return (
    <Stack direction={"column"}>
      {sortedDates.map(([date, transactions]) => {
        const sortedTransactions = [...transactions].sort((a, b) =>
          a.note.localeCompare(b.note),
        )

        return (
          <Stack key={date} direction={"column"} spacing={0.5}>
            <TransactionCategoryHeader
              transactions={transactions}
              date={date}
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
