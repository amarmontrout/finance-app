import { V2AccountType, V2TransactionType } from "@/api/v2/models"
import { getTransactionsV2 } from "@/api/v2/requests"
import { getTransactionsTotal } from "@/global/dataFunctions"
import { currencyFormatter, isoToLocalDate } from "@/global/formattingFunctions"
import {
  getDaysUntil,
  getNextMonthYear,
  getPreviousMonthYear,
} from "@/global/infoFunctions"
import { Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import AppCard from "../v2/components/AppCard"
import { getToday } from "../v2/utils"

const STATEMENT_START_DAY = "06"

const CreditCardEstimate = ({ accounts }: { accounts: V2AccountType[] }) => {
  const today = getToday()
  const [yearStr, monthStr, dayStr] = today.split("-")
  const prevMonthYear = getPreviousMonthYear({ isoString: today })
  const currMonthYear = `${yearStr}-${monthStr}`
  const nextMonthYear = getNextMonthYear({ isoString: today })

  const beforeStatement = Number(dayStr) < Number(STATEMENT_START_DAY)

  const startMonthYear = beforeStatement ? prevMonthYear : currMonthYear
  const endMonthYear = beforeStatement ? currMonthYear : nextMonthYear

  const statementStart = `${startMonthYear}-${STATEMENT_START_DAY}`
  const statementEnd = `${endMonthYear}-${STATEMENT_START_DAY}`

  const statementEndDisplay = useMemo(() => {
    const date = isoToLocalDate(statementEnd)
    date.setDate(date.getDate() - 1)
    return date
  }, [statementEnd])

  const [statementTransactions, setStatementTransactions] = useState<
    V2TransactionType[]
  >([])

  const creditCardAccount = useMemo(
    () => accounts.find((a) => a.type === "Credit Card"),
    [accounts],
  )

  useEffect(() => {
    const load = async () => {
      if (!creditCardAccount) {
        return
      }

      const transactions = await getTransactionsV2({
        filters: [
          {
            column: "transaction_date",
            operator: "gte",
            value: statementStart,
          },
          {
            column: "transaction_date",
            operator: "lt",
            value: statementEnd,
          },
          {
            column: "transaction_type",
            operator: "eq",
            value: "Expense",
          },
          {
            column: "account_id",
            operator: "eq",
            value: creditCardAccount.account_id,
          },
        ],
      })

      const sortedTransactions = (transactions ?? []).sort((a, b) =>
        a.transaction_date.localeCompare(b.transaction_date),
      )

      setStatementTransactions(sortedTransactions)
    }

    load().catch(console.error)
  }, [creditCardAccount, statementStart, statementEnd])

  const estimatedBill = useMemo(
    () =>
      getTransactionsTotal({
        transactions: statementTransactions,
      }),
    [statementTransactions],
  )

  const daysUntilStatementClose = getDaysUntil({
    targetDate: new Date(statementEnd),
    currentDate: new Date(),
  })

  return (
    <AppCard>
      <Stack
        direction={"column"}
        height={"100%"}
        justifyContent={"space-between"}
      >
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography variant={"h6"}>Credit Card Statement</Typography>

          <Typography variant="caption" alignSelf="center">
            {isoToLocalDate(statementStart).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
            {" - "}
            {statementEndDisplay.toLocaleDateString("en-US", {
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
            {statementTransactions.length} transactions
          </Typography>
        </Stack>
      </Stack>
    </AppCard>
  )
}

export default CreditCardEstimate
