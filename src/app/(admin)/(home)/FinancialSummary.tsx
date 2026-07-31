import { TransactionType } from "@/api/transactions/models"
import {
  getExpenseTransactionsByPaymentMethod,
  getTransactionsByType,
  getTransactionsTotal,
} from "@/global/dataFunctions"
import { currencyFormatter } from "@/global/formattingFunctions"
import { getPreviousMonthInfo } from "@/global/infoFunctions"
import NorthIcon from "@mui/icons-material/North"
import SouthIcon from "@mui/icons-material/South"
import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"

const FinancialSummary = ({
  today,
  transactions,
}: {
  today: { month: string; day: number; year: number }
  transactions: TransactionType[]
}) => {
  const { previousMonthString, previousYear } = getPreviousMonthInfo({
    month: today.month,
    year: today.year,
  })

  const summary = useMemo(() => {
    const currentIncome = getTransactionsByType({
      transactions,
      type: "income",
      month: today.month,
      year: today.year,
    })
    const previousIncome = getTransactionsByType({
      transactions,
      type: "income",
      month: previousMonthString,
      year: previousYear,
    })
    const currentDebitExpenses = getExpenseTransactionsByPaymentMethod({
      transactions,
      paymentMethod: "Debit",
      month: today.month,
      year: today.year,
    })
    const previousDebitExpenses = getExpenseTransactionsByPaymentMethod({
      transactions,
      paymentMethod: "Debit",
      month: previousMonthString,
      year: previousYear,
    })
    const incomeTotal = getTransactionsTotal({
      transactions: currentIncome,
    })
    const previousIncomeTotal = getTransactionsTotal({
      transactions: previousIncome,
    })
    const debitExpenseTotal = getTransactionsTotal({
      transactions: currentDebitExpenses,
    })
    const previousDebitExpenseTotal = getTransactionsTotal({
      transactions: previousDebitExpenses,
    })
    return {
      incomeTotal,
      previousIncomeTotal,
      debitExpenseTotal,
      previousDebitExpenseTotal,
      netIncome: incomeTotal - debitExpenseTotal,
      previousNetIncome: previousIncomeTotal - previousDebitExpenseTotal,
    }
  }, [transactions, today, previousMonthString, previousYear])
  return (
    <Stack direction={"column"} spacing={1}>
      <Box
        bgcolor={"rgba(255,255,255,0.15)"}
        border={`1px solid ${"#C9A86A"}`}
        borderRadius={5}
        minHeight={"150px"}
        padding={2}
      >
        <Stack
          direction={"column"}
          height={"100%"}
          justifyContent={"space-between"}
        >
          <Stack direction={"column"}>
            <Typography variant={"caption"}>Net Income</Typography>
            <Typography fontWeight={"bold"} variant={"h4"}>
              {currencyFormatter.format(summary.netIncome)}
            </Typography>
          </Stack>

          <Typography
            variant={"body2"}
            fontWeight={"bold"}
            width={"fit-content"}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color:
                summary.netIncome >= summary.previousNetIncome
                  ? "#7FB685"
                  : "#B85C5C",
              bgcolor:
                summary.netIncome >= summary.previousNetIncome
                  ? "rgba(0, 0, 0, 0.5)"
                  : "rgba(255, 255, 255, 0.5)",
              borderRadius: 2,
              px: 1,
              py: 0.75,
            }}
          >
            {summary.netIncome >= summary.previousNetIncome ? (
              <NorthIcon fontSize="small" />
            ) : (
              <SouthIcon fontSize="small" />
            )}
            {currencyFormatter.format(
              Math.abs(summary.netIncome - summary.previousNetIncome),
            )}{" "}
            vs last month
          </Typography>
        </Stack>
      </Box>

      <Stack direction={"row"} justifyContent={"space-between"} spacing={1}>
        <Box
          bgcolor={"rgba(255,255,255,0.15)"}
          border={`1px solid ${"#7FB685"}`}
          borderRadius={5}
          width={"100%"}
          padding={1.5}
        >
          <Stack direction={"column"}>
            <Typography variant={"caption"}>Income</Typography>
            <Typography fontWeight={"bold"} variant={"h6"}>
              {currencyFormatter.format(summary.incomeTotal)}
            </Typography>
          </Stack>
        </Box>

        <Box
          bgcolor={"rgba(255,255,255,0.15)"}
          border={`1px solid ${"#B85C5C"}`}
          borderRadius={5}
          width={"100%"}
          padding={1.5}
        >
          <Stack direction={"column"}>
            <Typography variant={"caption"}>Expense</Typography>
            <Typography fontWeight={"bold"} variant={"h6"}>
              {currencyFormatter.format(summary.debitExpenseTotal)}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  )
}

export default FinancialSummary
