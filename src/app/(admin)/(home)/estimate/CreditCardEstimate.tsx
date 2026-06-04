"use client"

import { TransactionType } from "@/api/transactions/models"
import { useTransactionContext } from "@/contexts/transaction-context"
import { neutralColor } from "@/global/colors"
import { getExpenseTransactionsByPaymentMethod } from "@/global/dataFunctions"
import {
  dateToDateType,
  dateTypeToTimestamp,
  numberToString,
  timestampToDateString,
} from "@/global/formattingFunctions"
import { getCurrentDateInfo } from "@/global/infoFunctions"
import { MONTH_INDEX } from "@/global/objects"
import { Button, Divider, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"

const MAX_VISIBLE = 8

const CreditCardEstimate = () => {
  const { transactions } = useTransactionContext()
  const { today } = getCurrentDateInfo()

  const [creditTransactions, setCreditTransactions] = useState<
    TransactionType[]
  >([])
  const [showAll, setShowAll] = useState(false)

  const creditCardPurchases = useMemo(
    () =>
      getExpenseTransactionsByPaymentMethod({
        transactions: transactions,
        paymentMethod: "Credit",
      }),
    [transactions],
  )

  useEffect(() => {
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

    const statementStart = new Date(
      startYear,
      startMonth,
      statementStartDay,
    ).getTime()
    const statementEndDate = new Date(
      startYear,
      startMonth + 1,
      statementStartDay - 1,
    )
    if (statementEndDate.getDate() <= 0)
      statementEndDate.setMonth(statementEndDate.getMonth(), 0)
    const statementEnd = statementEndDate.getTime()

    const filtered = creditCardPurchases
      .filter(
        (tx) =>
          dateTypeToTimestamp(tx.date) >= statementStart &&
          dateTypeToTimestamp(tx.date) <= statementEnd,
      )
      .sort(
        (a, b) => dateTypeToTimestamp(b.date!) - dateTypeToTimestamp(a.date!),
      )

    setCreditTransactions(filtered)
  }, [creditCardPurchases, today.day, today.month, today.year])

  const estimatedBill = useMemo(
    () => creditTransactions.reduce((total, tx) => total + tx.amount, 0),
    [creditTransactions],
  )

  const displayedTransactions = showAll
    ? creditTransactions
    : creditTransactions.slice(0, MAX_VISIBLE)

  if (transactions.length === 0) {
    return
  }

  return (
    <Stack spacing={1.5}>
      <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
        <Typography variant={"h6"} sx={{ fontWeight: 700 }}>
          Credit Card Estimate
        </Typography>
        <Typography variant="h6" sx={{ textAlign: "right" }}>
          ${numberToString(estimatedBill)}
        </Typography>
      </Stack>

      {/* Transaction List */}
      <Stack
        spacing={0.5}
        sx={{
          paddingX: 1,
        }}
        divider={<Divider sx={{ borderColor: neutralColor.color }} />}
      >
        {displayedTransactions.map((tx) => {
          const { month, day, year } = tx.date!
          const txDate = new Date(year, MONTH_INDEX[month], day!)
          const formattedDate = timestampToDateString(
            dateTypeToTimestamp(dateToDateType(txDate)),
          )

          return (
            <Stack
              key={tx.id}
              direction={"row"}
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Stack spacing={0.5}>
                <Typography variant={"body2"} sx={{ fontWeight: 500 }}>
                  {tx.note}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formattedDate}
                </Typography>
              </Stack>

              <Typography sx={{ fontWeight: 600 }}>
                ${numberToString(tx.amount ?? 0)}
              </Typography>
            </Stack>
          )
        })}

        {/* Show More / Show Less Button */}
        {creditTransactions.length > MAX_VISIBLE && (
          <Button
            size="small"
            onClick={() => setShowAll((prev) => !prev)}
            sx={{
              color: neutralColor.color,
              bgcolor: neutralColor.bg,
            }}
          >
            {showAll
              ? "Show Less"
              : `Show ${creditTransactions.length - MAX_VISIBLE} More`}
          </Button>
        )}
      </Stack>
    </Stack>
  )
}

export default CreditCardEstimate
