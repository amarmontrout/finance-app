import LoadingCircle from "@/components/LoadingCircle"
import { formattedStringNumber } from "@/utils/helperFunctions"
import { getTotalsForMonthNetCash } from "../../utils/functions"
import { getNetCashFlow } from "@/utils/financialFunctions"
import { TransactionType } from "@/utils/type"
import {
  positiveColor,
  negativeColor,
  neutralColor,
  infoColor,
} from "@/globals/colors"
import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { MONTH_INDEX } from "@/globals/globals"

const SummaryCard = ({
  title,
  amount,
  comparison,
  type = "net",
  isLoading,
}: {
  title: string
  amount: number
  comparison?: number
  type?: "income" | "expense" | "net" | "total"
  isLoading: boolean
}) => {
  const typeStyles = {
    income: {
      main: positiveColor.color,
      bg: positiveColor.bg,
    },
    expense: {
      main: negativeColor.color,
      bg: negativeColor.bg,
    },
    net: {
      main: neutralColor.color,
      bg: neutralColor.bg,
    },
    total: {
      main: infoColor.color,
      bg: infoColor.bg,
    },
  }
  const style = typeStyles[type]
  const diff = comparison !== undefined ? amount - comparison : undefined
  const isPositive = diff !== undefined && diff >= 0

  return (
    <Box
      width={"100%"}
      borderRadius={2}
      border={`1px solid rgba(0,0,0,0.2)`}
      bgcolor={style.bg}
      py={1.5}
      px={2}
      sx={{
        boxShadow: `
          0 1px 2px rgba(0,0,0,0.04),
          0 4px 12px rgba(0,0,0,0.06)
        `,
      }}
    >
      {isLoading ? (
        <LoadingCircle height={72} />
      ) : (
        <Stack height={"100%"} justifyContent={"space-between"}>
          {/* Title */}
          <Typography fontSize={"0.75rem"} fontWeight={600} color={"text.main"}>
            {title}
          </Typography>

          {/* Amount */}
          <Typography
            fontSize={"1.5rem"}
            fontWeight={600}
            sx={{ color: style.main }}
          >
            ${formattedStringNumber(amount)}
          </Typography>

          {/* Comparison */}
          {comparison !== undefined && (
            <Typography
              fontSize={"0.73rem"}
              color={"text.secondary"}
              textAlign={"right"}
            >
              <span
                style={{
                  fontWeight: 700,
                }}
              >
                {isPositive ? "+" : "-"}$
                {formattedStringNumber(Math.abs(diff!))}
              </span>{" "}
              last month
            </Typography>
          )}
        </Stack>
      )}
    </Box>
  )
}

const MonthlySummary = ({
  transactions,
  currentMonth,
  currentYear,
  isLoading,
}: {
  transactions: TransactionType[]
  currentMonth: string
  currentYear: number
  isLoading: boolean
}) => {
  const {
    incomeTotalMonthNet,
    expenseTotalMonthNet,
    incomeTotalMonthNetPrev,
    expenseTotalMonthNetPrev,
  } = getTotalsForMonthNetCash(currentYear, currentMonth, transactions)
  const netMonthIncome = getNetCashFlow(
    incomeTotalMonthNet,
    expenseTotalMonthNet,
  )
  const netMonthIncomePrev = getNetCashFlow(
    incomeTotalMonthNetPrev,
    expenseTotalMonthNetPrev,
  )

  const { currentTotal, previousTotal } = useMemo(() => {
    const currentMonthIndex = MONTH_INDEX[currentMonth]
    const prevMonthIndex = (currentMonthIndex + 11) % 12
    const prevYear = currentMonthIndex === 0 ? currentYear - 1 : currentYear
    let currentSum = 0
    let previousSum = 0
    transactions.forEach((t) => {
      if (t.type !== "expense") return
      const tMonthIndex = MONTH_INDEX[t.date.month]
      const tYear = t.date.year
      const amount = t.is_return ? -t.amount : t.amount

      if (tMonthIndex === currentMonthIndex && tYear === currentYear) {
        currentSum += amount
      } else if (tMonthIndex === prevMonthIndex && tYear === prevYear) {
        previousSum += amount
      }
    })
    return { currentTotal: currentSum, previousTotal: previousSum }
  }, [transactions, currentMonth, currentYear])

  return (
    <Stack direction={"column"} spacing={1}>
      <Stack direction={"row"} spacing={1}>
        <SummaryCard
          title="Income"
          amount={incomeTotalMonthNet}
          comparison={incomeTotalMonthNetPrev}
          type="income"
          isLoading={isLoading}
        />

        <SummaryCard
          title="Expenses"
          amount={expenseTotalMonthNet}
          comparison={expenseTotalMonthNetPrev}
          type="expense"
          isLoading={isLoading}
        />
      </Stack>
      <Stack direction={"row"} spacing={1}>
        <SummaryCard
          title="Net Cash"
          amount={netMonthIncome}
          comparison={netMonthIncomePrev}
          type="net"
          isLoading={isLoading}
        />

        <SummaryCard
          title="Total Spending"
          amount={currentTotal}
          comparison={previousTotal}
          type="total"
          isLoading={isLoading}
        />
      </Stack>
    </Stack>
  )
}

export default MonthlySummary
