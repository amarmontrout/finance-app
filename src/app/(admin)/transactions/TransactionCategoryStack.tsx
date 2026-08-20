import {
  V2CategoryType,
  V2MerchantType,
  V2TransactionType,
} from "@/api/v2/models"
import { AlertToastType, HookSetter } from "@/types/types"
import { Stack } from "@mui/material"
import { useMemo } from "react"
import TransactionCategoryHeader from "./TransactionCategoryHeader"
import TransactionCategoryList from "./TransactionCategoryList"

const TransactionCategoryStack = ({
  transactionsByType,
  selectedTransaction,
  setSelectedTransaction,
  refreshTransactions,
  openDialog,
  setOpenDialog,
  setAlertToast,
  merchants,
  categories,
}: {
  transactionsByType: V2TransactionType[]
  selectedTransaction: V2TransactionType | null
  setSelectedTransaction: HookSetter<V2TransactionType | null>
  refreshTransactions: () => Promise<void>
  openDialog: boolean
  setOpenDialog: HookSetter<boolean>
  setAlertToast: HookSetter<AlertToastType | undefined>
  merchants: V2MerchantType[]
  categories: V2CategoryType[]
}) => {
  const merchantMap = useMemo(
    () => new Map(merchants.map((m) => [m.merchant_id, m])),
    [merchants],
  )

  const groupedTransactions = useMemo(() => {
    const grouped = transactionsByType.reduce<
      Record<string, V2TransactionType[]>
    >((acc, transaction) => {
      const date = transaction.transaction_date

      if (!acc[date]) acc[date] = []
      acc[date].push(transaction)

      return acc
    }, {})

    return Object.entries(grouped).sort(([dateA], [dateB]) =>
      dateB.localeCompare(dateA),
    )
  }, [transactionsByType])

  return (
    <Stack direction={"column"}>
      {groupedTransactions.map(([date, transactions]) => {
        const sortedTransactions = [...transactions].sort((a, b) => {
          const merchantA = merchantMap.get(a.merchant_id)?.name ?? ""
          const merchantB = merchantMap.get(b.merchant_id)?.name ?? ""

          return merchantA.localeCompare(merchantB)
        })

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
              merchants={merchants}
              categories={categories}
            />
          </Stack>
        )
      })}
    </Stack>
  )
}

export default TransactionCategoryStack
