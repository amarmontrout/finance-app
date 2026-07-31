import { TransactionType } from "@/api/transactions/models"
import { getTransactionsTotal } from "@/global/dataFunctions"
import {
  currencyFormatter,
  dateTypeToTimestamp,
} from "@/global/formattingFunctions"
import { MONTH_INDEX } from "@/global/objects"
import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"

const CreditCardEstimate = ({
  today,
  transactions,
}: {
  today: { month: string; day: number; year: number }
  transactions: TransactionType[]
}) => {
  const { statementStart, statementEnd } = useMemo(() => {
    const statementStartDay = 6

    let startMonth = MONTH_INDEX[today.month]
    let startYear = today.year

    if (today.day < statementStartDay) {
      startMonth -= 1

      if (startMonth < 0) {
        startMonth = 11
        startYear -= 1
      }
    }

    const start = new Date(startYear, startMonth, statementStartDay)

    const end = new Date(startYear, startMonth + 1, statementStartDay - 1)

    return {
      statementStart: start,
      statementEnd: end,
    }
  }, [today.day, today.month, today.year])

  const creditTransactions = useMemo(
    () =>
      transactions
        .filter(
          (tx) =>
            tx.payment_method === "Credit" &&
            dateTypeToTimestamp(tx.date) >= statementStart.getTime() &&
            dateTypeToTimestamp(tx.date) <= statementEnd.getTime(),
        )
        .sort(
          (a, b) => dateTypeToTimestamp(b.date!) - dateTypeToTimestamp(a.date!),
        ),
    [transactions, statementStart, statementEnd],
  )

  const estimatedBill = useMemo(
    () =>
      getTransactionsTotal({
        transactions: creditTransactions,
      }),
    [creditTransactions],
  )

  const getDaysUntil = (targetDate: Date, currentDate: Date = new Date()) => {
    const millisecondsPerDay = 1000 * 60 * 60 * 24

    const target = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
    )

    const current = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    )

    const days = Math.ceil(
      (target.getTime() - current.getTime()) / millisecondsPerDay,
    )

    return Math.max(days, 0)
  }

  const daysUntilStatementClose = getDaysUntil(statementEnd, new Date())

  return (
    <Box bgcolor={"rgba(255,255,255,0.15)"} borderRadius={5} padding={2}>
      <Stack
        direction={"column"}
        height={"100%"}
        justifyContent={"space-between"}
      >
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography variant={"h6"}>Credit Card Statement</Typography>

          <Typography variant={"caption"} alignSelf={"center"}>
            {statementStart.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
            {" - "}
            {statementEnd.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </Typography>
        </Stack>

        <Typography fontWeight={"bold"} variant={"h5"}>
          {currencyFormatter.format(estimatedBill)}
        </Typography>

        <Stack direction={"column"} textAlign={"right"}>
          <Typography variant="body2">
            {daysUntilStatementClose} days remaining
          </Typography>
          <Typography variant={"body2"}>
            {creditTransactions.length} transactions
          </Typography>
        </Stack>
      </Stack>
    </Box>
  )
}

export default CreditCardEstimate
