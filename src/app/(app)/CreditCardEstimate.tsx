import { Stack, Typography, Divider, Button } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { TransactionType } from "@/utils/type"
import { formattedStringNumber, toTimestamp } from "@/utils/helperFunctions"
import { MONTH_INDEX } from "@/globals/globals"
import { neutralColor } from "@/globals/colors"

const MAX_VISIBLE = 5

const CreditCardEstimate = ({
  transactions,
  currentMonth,
  currentDay,
  currentYear,
}: {
  transactions: TransactionType[]
  currentMonth: string
  currentDay: number
  currentYear: number
}) => {
  const [creditTransactions, setCreditTransactions] = useState<
    TransactionType[]
  >([])
  const [showAll, setShowAll] = useState(false)

  const getEstimatedCreditBill = (transactions: TransactionType[]) =>
    transactions.reduce((total, tx) => total + (tx.amount ?? 0), 0)

  useEffect(() => {
    const statementStartDay = 6
    let startMonth = MONTH_INDEX[currentMonth]
    let startYear = currentYear

    if (currentDay < statementStartDay) {
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

    const filtered = transactions
      .filter(
        (tx) =>
          tx.date &&
          tx.date.day != null &&
          tx.type === "expense" &&
          tx.payment_method === "Credit" &&
          toTimestamp(tx.date) >= statementStart &&
          toTimestamp(tx.date) <= statementEnd,
      )
      .sort((a, b) => toTimestamp(b.date!) - toTimestamp(a.date!))

    setCreditTransactions(filtered)
  }, [transactions, currentDay, currentMonth, currentYear])

  const estimatedBill = useMemo(
    () => getEstimatedCreditBill(creditTransactions),
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
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Typography variant={"h6"} fontWeight={700}>
          Credit Card Estimate
        </Typography>
        <Typography variant="h6" textAlign={"right"}>
          ${formattedStringNumber(estimatedBill)}
        </Typography>
      </Stack>

      {/* Transaction List */}
      <Stack
        spacing={0.5}
        px={1}
        divider={<Divider sx={{ borderColor: neutralColor.color }} />}
      >
        {displayedTransactions.map((tx) => {
          const { month, day, year } = tx.date!
          const txDate = new Date(year, MONTH_INDEX[month], day!)
          const formattedDate = txDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })

          return (
            <Stack
              key={tx.id}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Stack spacing={0.5}>
                <Typography variant="body2" fontWeight={500}>
                  {tx.note}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formattedDate}
                </Typography>
              </Stack>

              <Typography fontWeight={600}>
                ${formattedStringNumber(tx.amount ?? 0)}
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
