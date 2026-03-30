import LoadingCircle from "@/components/LoadingCircle"
import { formattedStringNumber } from "@/utils/helperFunctions"
import { getTotalsForMonthNetCash } from "./experimental/functions"
import { getNetCashFlow } from "@/utils/financialFunctions"
import { NewTransactionType } from "@/utils/type"
import { positiveColor, negativeColor, neutralColor } from "@/globals/colors"
import { Box, Stack, Typography } from "@mui/material"

const SummaryCard = ({
  title,
  amount,
  comparison,
  type = "net",
}: {
  title: string
  amount: number
  comparison?: number
  type?: "income" | "expense" | "net"
}) => {
  const typeStyles = {
    income: {
      main: positiveColor,
      bg: "rgba(22, 163, 74, 0.2)",
    },
    expense: {
      main: negativeColor,
      bg: "rgba(220, 38, 38, 0.2)",
    },
    net: {
      main: neutralColor,
      bg: "rgba(37, 99, 235, 0.2)",
    },
  }
  const style = typeStyles[type]
  const diff = comparison !== undefined ? amount - comparison : undefined
  const isPositive = diff !== undefined && diff >= 0

  return (
    <Box
      width={"100%"}
      height={"115px"}
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
      <Stack height={"100%"} justifyContent={"space-between"}>
        {/* Title */}
        <Typography
          fontSize={"0.75rem"}
          fontWeight={500}
          color={"text.secondary"}
        >
          {title}
        </Typography>

        {/* Amount */}
        <Typography
          fontSize="1.15rem"
          fontWeight={600}
          sx={{ color: style.main }}
        >
          ${formattedStringNumber(amount)}
        </Typography>

        {/* Comparison */}
        {comparison !== undefined && (
          <Typography fontSize={"0.7rem"} color={"text.secondary"}>
            <span
              style={{
                color: isPositive ? style.main : "#6b7280",
                fontWeight: 500,
              }}
            >
              {isPositive ? "+" : ""}${formattedStringNumber(diff!)}
            </span>{" "}
            last month
          </Typography>
        )}
      </Stack>
    </Box>
  )
}

const MonthlySummary = ({
  transactions,
  currentMonth,
  currentYear,
  isLoading,
}: {
  transactions: NewTransactionType[]
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

  return isLoading ? (
    <LoadingCircle />
  ) : (
    <Stack direction={"row"} spacing={1}>
      <SummaryCard
        title="Income"
        amount={incomeTotalMonthNet}
        comparison={incomeTotalMonthNetPrev}
        type="income"
      />

      <SummaryCard
        title="Expenses"
        amount={expenseTotalMonthNet}
        comparison={expenseTotalMonthNetPrev}
        type="expense"
      />

      <SummaryCard
        title="Net Cash"
        amount={netMonthIncome}
        comparison={netMonthIncomePrev}
        type="net"
      />
    </Stack>
  )
}

export default MonthlySummary
