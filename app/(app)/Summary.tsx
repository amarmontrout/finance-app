import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import { Skeleton, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { TransactionType } from "../(api)/transactions/models"
import { getTransactions } from "../(api)/transactions/requests"
import SummaryCard from "../components/ui/SummaryCard"
import { useDataContext } from "../contexts/data-context"
import { useTransactionContext } from "../contexts/transaction-context"
import { ACCENT_COLOR, NEGATIVE_COLOR, POSITIVE_COLOR } from "../data/colors"
import { currencyFormatter } from "../lib/functions/formatters"
import {
  getISOMonth,
  getISOMonthWithOffset,
  getMonthRange,
  getTotalIncomeAndExpense,
} from "../lib/functions/getters"

type InfoType = { current: TransactionType[]; previous: TransactionType[] }
const DEFAULT_INFO: InfoType = { current: [], previous: [] }

const SummaryValue = ({
  label,
  value,
  loading,
  textColor,
}: {
  label: string
  value: number
  loading: boolean
  textColor: string
}) => {
  return (
    <Stack direction={"column"}>
      <Typography variant={"caption"} sx={{ color: textColor }}>
        {label}
      </Typography>
      <Typography variant={"h6"} sx={{ fontWeight: 700 }}>
        {loading ? <Skeleton /> : currencyFormatter.format(value)}
      </Typography>
    </Stack>
  )
}

const Summary = () => {
  const { accountMap } = useDataContext()
  const { transactions } = useTransactionContext()

  const [isTransactionsLoading, setIsTransactionsLoading] = useState(true)
  const [transactionInfo, setTransactionInfo] = useState<InfoType>(DEFAULT_INFO)

  const current = getTotalIncomeAndExpense({
    transactions: transactionInfo.current,
    accountMap,
  })
  const previous = getTotalIncomeAndExpense({
    transactions: transactionInfo.previous,
    accountMap,
  })

  const fetchTransactions = async () => {
    setIsTransactionsLoading(true)
    const currMonth = getISOMonth()
    const prevMonth = getISOMonthWithOffset(currMonth, -1)

    try {
      const [currTrans, prevTrans] = await Promise.all([
        getTransactions(getMonthRange(currMonth)),
        getTransactions(getMonthRange(prevMonth)),
      ])
      setTransactionInfo({ current: currTrans, previous: prevTrans })
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
    <Stack direction={"column"} spacing={2}>
      <Typography>Finanical Health</Typography>

      <SummaryCard borderColor={ACCENT_COLOR} padding={2}>
        <Stack direction={"column"} spacing={1}>
          <Stack direction={"column"}>
            <Typography variant={"caption"} sx={{ color: ACCENT_COLOR }}>
              Net Income
            </Typography>
            <Typography variant={"h4"} sx={{ fontWeight: 700 }}>
              {isTransactionsLoading ? (
                <Skeleton />
              ) : (
                currencyFormatter.format(current.netIncome)
              )}
            </Typography>
          </Stack>
          {isTransactionsLoading ? (
            <Skeleton height={"20px"} />
          ) : (
            <Typography
              variant={"body2"}
              sx={{
                display: "flex",
                fontWeight: 700,
                color:
                  current.netIncome >= previous.netIncome
                    ? POSITIVE_COLOR
                    : NEGATIVE_COLOR,
              }}
            >
              {current.netIncome >= previous.netIncome ? (
                <ArrowDropUpIcon fontSize={"small"} />
              ) : (
                <ArrowDropDownIcon fontSize={"small"} />
              )}
              {currencyFormatter.format(
                Math.abs(current.netIncome - previous.netIncome),
              )}{" "}
              vs last month
            </Typography>
          )}
        </Stack>
      </SummaryCard>

      <Stack direction={"row"} spacing={2}>
        <SummaryCard borderColor={POSITIVE_COLOR} padding={1.5}>
          <SummaryValue
            label={"Income"}
            value={current.totalIncome}
            loading={isTransactionsLoading}
            textColor={POSITIVE_COLOR}
          />
        </SummaryCard>

        <SummaryCard borderColor={NEGATIVE_COLOR} padding={1.5}>
          <SummaryValue
            label={"Expense"}
            value={current.totalExpense}
            loading={isTransactionsLoading}
            textColor={NEGATIVE_COLOR}
          />
        </SummaryCard>
      </Stack>
    </Stack>
  )
}

export default Summary
