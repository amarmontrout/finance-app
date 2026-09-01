import { useDataContext } from "@/contexts/data-context"
import { HookSetter } from "@/types/types"
import { Stack } from "@mui/material"
import { useTransactionContext } from "../v2/TransactionsContext"
import TransactionCategoryHeader from "./TransactionCategoryHeader"
import TransactionList from "./TransactionList"

const TransactionDisplay = ({
  setOpenDialog,
}: {
  setOpenDialog: HookSetter<boolean>
}) => {
  const { merchantMap } = useDataContext()
  const { byDateTransactions } = useTransactionContext()

  return (
    <Stack direction={"column"}>
      {byDateTransactions.map(([date, transactions]) => {
        const sortedTransactions = [...transactions].sort((a, b) => {
          const merchantA = merchantMap.get(a.merchant_id!)?.name ?? ""
          const merchantB = merchantMap.get(b.merchant_id!)?.name ?? ""
          return merchantA.localeCompare(merchantB)
        })

        return (
          <Stack key={date} direction={"column"} spacing={0.5}>
            <TransactionCategoryHeader
              transactions={transactions}
              date={date}
            />

            <TransactionList
              sortedTransactions={sortedTransactions}
              setOpenDialog={setOpenDialog}
            />
          </Stack>
        )
      })}
    </Stack>
  )
}

export default TransactionDisplay
