import { Skeleton, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { TransactionType } from "../(api)/transactions/models"
import { getTransactions } from "../(api)/transactions/requests"
import { useDataContext } from "../contexts/data-context"
import { useTransactionContext } from "../contexts/transaction-context"
import { currencyFormatter } from "../lib/functions/formatters"
import { getDateRangeGivenStartDay, getISODate } from "../lib/functions/getters"

const CreditCardEstimate = () => {
  const { transactions, getReturnedAmount } = useTransactionContext()
  const { accountMap } = useDataContext()

  const [isTransactionsLoading, setIsTransactionsLoading] = useState(true)
  const [creditTransactions, setCreditTransactions] = useState<
    TransactionType[]
  >([])

  const fetchTransactions = async () => {
    setIsTransactionsLoading(true)

    try {
      const transactionsInRange: TransactionType[] = await getTransactions(
        getDateRangeGivenStartDay({ date: getISODate(), startDay: 6 }),
      )
      const validCredit = transactionsInRange.filter((t) => {
        return (
          t.transaction_type === "Expense" &&
          t.is_paid &&
          accountMap.get(t.account_id!)?.type === "Credit Card"
        )
      })
      setCreditTransactions(validCredit)
    } catch (error) {
      console.error(error)
    }

    setIsTransactionsLoading(false)
  }

  useEffect(() => {
    if (!transactions.length) return
    fetchTransactions()
  }, [transactions.length])

  return (
    <Stack direction={"column"} spacing={1}>
      <Typography>Credit Card Estimate</Typography>
      <Typography variant={"h4"} sx={{ fontWeight: 700 }}>
        {isTransactionsLoading ? <Skeleton /> : currencyFormatter.format(0)}
      </Typography>
    </Stack>
  )
}

export default CreditCardEstimate
