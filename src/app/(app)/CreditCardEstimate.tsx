import { Stack, Typography, Divider, Button } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { NewTransactionType } from "@/utils/type"
import { formattedStringNumber } from "@/utils/helperFunctions"
import { MONTH_INDEX } from "@/globals/globals"
import { neutralColor } from "@/globals/colors"

const MAX_VISIBLE = 5

const CreditCardEstimate = ({
  transactions,
  currentMonth,
  currentDay,
  currentYear,
}: {
  transactions: NewTransactionType[]
  currentMonth: string
  currentDay: number
  currentYear: number
}) => {
  const [creditTransactions, setCreditTransactions] = useState<
    NewTransactionType[]
  >([])
  const [showAll, setShowAll] = useState(false)

  const getEstimatedCreditBill = (transactions: NewTransactionType[]) =>
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

    const statementStart = new Date(startYear, startMonth, statementStartDay)
    const statementEnd = new Date(
      statementStart.getFullYear(),
      statementStart.getMonth() + 1,
      statementStartDay - 1,
    )
    if (statementEnd.getDate() <= 0)
      statementEnd.setMonth(statementEnd.getMonth(), 0)

    const filtered = transactions
      .filter((tx) => {
        if (!tx.date || tx.date.day == null) return false
        if (tx.type !== "expense" || tx.payment_method !== "Credit")
          return false
        const monthIndex = MONTH_INDEX[tx.date.month]
        const txDate = new Date(tx.date.year, monthIndex, tx.date.day)
        return txDate >= statementStart && txDate <= statementEnd
      })
      .sort((a, b) => {
        const aDate = new Date(
          a.date!.year,
          MONTH_INDEX[a.date!.month],
          a.date!.day!,
        )
        const bDate = new Date(
          b.date!.year,
          MONTH_INDEX[b.date!.month],
          b.date!.day!,
        )
        return bDate.getTime() - aDate.getTime()
      })

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
