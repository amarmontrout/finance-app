import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import { Box, Skeleton, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { TransactionType } from "../(api)/transactions/models"
import { getTransactions } from "../(api)/transactions/requests"
import Section from "../components/Section"
import SummaryCard from "../components/ui/SummaryCard"
import { useDataContext } from "../contexts/data-context"
import { useTransactionContext } from "../contexts/transaction-context"
import { ACCENT_COLOR, NEGATIVE_COLOR, POSITIVE_COLOR } from "../data/colors"
import { currencyFormatter } from "../lib/functions/formatters"
import {
  getDateRange,
  getTotalIncomeAndExpense,
} from "../lib/functions/getters"

const Summary = () => {
  const { accountMap, isDataContextLoading } = useDataContext()
  const { transactions } = useTransactionContext()

  const [isTransactionsLoading, setIsTransactionsLoading] = useState(true)
  const [currTransactions, setCurrTransactions] = useState<TransactionType[]>(
    [],
  )
  const [prevTransactions, setPrevTransactions] = useState<TransactionType[]>(
    [],
  )

  const isPageLoading = isDataContextLoading || isTransactionsLoading
  const current = getTotalIncomeAndExpense({
    transactions: currTransactions,
    accountMap,
  })
  const previous = getTotalIncomeAndExpense({
    transactions: prevTransactions,
    accountMap,
  })

  const fetchTransactions = async () => {
    setIsTransactionsLoading(true)
    const currMonth = new Date()
    const prevMonth = new Date()
    prevMonth.setMonth(prevMonth.getMonth() - 1)

    try {
      const [currTrans, prevTrans] = await Promise.all([
        getTransactions(getDateRange(currMonth)),
        getTransactions(getDateRange(prevMonth)),
      ])
      setCurrTransactions(currTrans)
      setPrevTransactions(prevTrans)
    } catch (error) {
      console.error(error)
    } finally {
      setIsTransactionsLoading(false)
    }
  }

  useEffect(() => {
    if (!transactions.length) return
    fetchTransactions()
  }, [transactions.length])

  return (
    <Box>
      <Section>
        <SummaryCard borderColor={ACCENT_COLOR} padding={2}>
          <Stack direction={"column"} spacing={1}>
            <Stack direction={"column"}>
              <Typography variant={"caption"}>Net Income</Typography>
              <Typography variant={"h4"} sx={{ fontWeight: 700 }}>
                {isPageLoading ? (
                  <Skeleton />
                ) : (
                  currencyFormatter.format(current.netIncome)
                )}
              </Typography>
            </Stack>
            {isPageLoading ? (
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
      </Section>

      <Stack direction={"row"} spacing={2}>
        <SummaryCard borderColor={POSITIVE_COLOR} padding={1.5}>
          <Stack direction={"column"}>
            <Typography variant={"caption"}>Income</Typography>
            <Typography variant={"h6"} sx={{ fontWeight: 700 }}>
              {isPageLoading ? (
                <Skeleton />
              ) : (
                currencyFormatter.format(current.totalIncome)
              )}
            </Typography>
          </Stack>
        </SummaryCard>

        <SummaryCard borderColor={NEGATIVE_COLOR} padding={1.5}>
          <Stack direction={"column"}>
            <Typography variant={"caption"}>Expense</Typography>
            <Typography variant={"h6"} sx={{ fontWeight: 700 }}>
              {isPageLoading ? (
                <Skeleton />
              ) : (
                currencyFormatter.format(current.totalExpense)
              )}
            </Typography>
          </Stack>
        </SummaryCard>
      </Stack>
    </Box>
  )
}

export default Summary
