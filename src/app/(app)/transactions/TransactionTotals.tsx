import ShowCaseCard from "@/components/ShowCaseCard"
import { MONTHS } from "@/globals/globals"
import { getYearUpToMonthTotalV2 } from "@/utils/getTotals"
import { formattedStringNumber } from "@/utils/helperFunctions"
import { TransactionTypeV2 } from "@/utils/type"
import { Stack, Typography } from "@mui/material"
import { useMemo } from "react"

const TransactionTotals = ({
  selectedYear,
  currentYear,
  passedMonths,
  incomeTransactionsV2,
  expenseTransactionsV2,
  excludedSet,
}: {
  selectedYear: number
  currentYear: number
  passedMonths: string[]
  incomeTransactionsV2: TransactionTypeV2[]
  expenseTransactionsV2: TransactionTypeV2[]
  excludedSet: Set<string>
}) => {
  const yearIncomeTotal = useMemo(() => {
    const elapsedMonths = selectedYear === currentYear ? passedMonths : MONTHS
    return getYearUpToMonthTotalV2(
      selectedYear,
      elapsedMonths,
      incomeTransactionsV2,
      excludedSet,
    )
  }, [selectedYear, incomeTransactionsV2, excludedSet])

  const yearExpenseTotal = useMemo(() => {
    const elapsedMonths = selectedYear === currentYear ? passedMonths : MONTHS

    return getYearUpToMonthTotalV2(
      selectedYear,
      elapsedMonths,
      expenseTransactionsV2,
      excludedSet,
    )
  }, [selectedYear, expenseTransactionsV2, excludedSet])

  const incomeByMonth = useMemo(() => {
    const map: Record<string, number> = {}

    for (const month of MONTHS) {
      map[month] = 0
    }

    for (const income of incomeTransactionsV2) {
      if (income.year === selectedYear && !excludedSet.has(income.category)) {
        map[income.month] += income.amount
      }
    }

    return map
  }, [incomeTransactionsV2, selectedYear, excludedSet])

  const ExpenseByMonth = useMemo(() => {
    const map: Record<string, number> = {}

    for (const month of MONTHS) {
      map[month] = 0
    }

    for (const expense of expenseTransactionsV2) {
      if (expense.year === selectedYear && !excludedSet.has(expense.category)) {
        map[expense.month] += expense.amount
      }
    }

    return map
  }, [expenseTransactionsV2, selectedYear, excludedSet])

  return (
    <ShowCaseCard title={""}>
      <Stack direction={"row"} width={"100%"} spacing={1}>
        <Stack direction={"column"} width={"30%"}>
          <Typography width={"100%"} textAlign={"center"}>
            Month
          </Typography>
          {MONTHS.map((month) => {
            return (
              <Typography key={month} variant={"h6"}>
                {month}
              </Typography>
            )
          })}
          <hr />
          <Typography variant={"h6"}>
            {selectedYear === currentYear && "YTD "}
            {selectedYear}
          </Typography>
        </Stack>

        <Stack direction={"column"} width={"35%"} textAlign={"right"}>
          <Typography width={"100%"} textAlign={"center"}>
            Income
          </Typography>
          {MONTHS.map((month) => (
            <Typography key={month} color="success" variant="h6">
              ${formattedStringNumber(incomeByMonth[month] ?? 0)}
            </Typography>
          ))}
          <hr />
          <Typography variant={"h6"}>{`$${yearIncomeTotal}`}</Typography>
        </Stack>

        <Stack direction={"column"} width={"35%"} textAlign={"right"}>
          <Typography width={"100%"} textAlign={"center"}>
            Expense
          </Typography>
          {MONTHS.map((month) => (
            <Typography key={month} color="error" variant="h6">
              ${formattedStringNumber(ExpenseByMonth[month] ?? 0)}
            </Typography>
          ))}
          <hr />
          <Typography variant={"h6"}>{`$${yearExpenseTotal}`}</Typography>
        </Stack>
      </Stack>
    </ShowCaseCard>
  )
}

export default TransactionTotals
