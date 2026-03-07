import ShowCaseCard from "@/components/ShowCaseCard"
import { negativeColor, positiveColor } from "@/globals/colors"
import { MONTHS } from "@/globals/globals"
import { getYearUpToMonthTotal } from "@/utils/getTotals"
import { formattedStringNumber } from "@/utils/helperFunctions"
import { TransactionType } from "@/utils/type"
import { Stack, Typography } from "@mui/material"
import { useMemo } from "react"

const TransactionTotals = ({
  selectedYear,
  currentYear,
  passedMonths,
  incomeTransactions,
  expenseTransactions,
  excludedSet,
}: {
  selectedYear: number
  currentYear: number
  passedMonths: string[]
  incomeTransactions: TransactionType[]
  expenseTransactions: TransactionType[]
  excludedSet: Set<string>
}) => {
  const yearIncomeTotal = useMemo(() => {
    const elapsedMonths = selectedYear === currentYear ? passedMonths : MONTHS
    return getYearUpToMonthTotal(
      selectedYear,
      elapsedMonths,
      incomeTransactions,
      excludedSet,
    )
  }, [selectedYear, incomeTransactions, excludedSet])

  const yearExpenseTotal = useMemo(() => {
    const elapsedMonths = selectedYear === currentYear ? passedMonths : MONTHS

    return getYearUpToMonthTotal(
      selectedYear,
      elapsedMonths,
      expenseTransactions,
      excludedSet,
    )
  }, [selectedYear, expenseTransactions, excludedSet])

  const incomeByMonth = useMemo(() => {
    const map: Record<string, number> = {}

    for (const month of MONTHS) {
      map[month] = 0
    }

    for (const income of incomeTransactions) {
      if (income.year === selectedYear && !excludedSet.has(income.category)) {
        map[income.month] += income.amount
      }
    }

    return map
  }, [incomeTransactions, selectedYear, excludedSet])

  const ExpenseByMonth = useMemo(() => {
    const map: Record<string, number> = {}

    for (const month of MONTHS) {
      map[month] = 0
    }

    for (const expense of expenseTransactions) {
      if (expense.year === selectedYear && !excludedSet.has(expense.category)) {
        map[expense.month] += expense.amount
      }
    }

    return map
  }, [expenseTransactions, selectedYear, excludedSet])

  return (
    <ShowCaseCard title="">
      <Stack className="xl:w-[50%]" spacing={2} margin={"0 auto"}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          px={1}
          pb={1}
          sx={{ borderBottom: "1px solid", borderColor: "divider" }}
        >
          <Typography fontWeight={700}>Month</Typography>
          <Stack direction="row" spacing={9}>
            <Typography
              fontWeight={700}
              sx={{
                color: positiveColor,
              }}
            >
              Income
            </Typography>
            <Typography
              fontWeight={700}
              sx={{
                color: negativeColor,
              }}
            >
              Expense
            </Typography>
          </Stack>
        </Stack>

        {/* Monthly Rows */}
        <Stack spacing={1}>
          {MONTHS.map((month) => (
            <Stack
              key={month}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              px={1}
            >
              <Typography>{month}</Typography>

              <Stack direction="row" spacing={6}>
                <Typography
                  fontWeight={500}
                  textAlign="right"
                  minWidth={90}
                  sx={{
                    color: positiveColor,
                  }}
                >
                  ${formattedStringNumber(incomeByMonth[month] ?? 0)}
                </Typography>

                <Typography
                  fontWeight={500}
                  textAlign="right"
                  minWidth={90}
                  sx={{
                    color: negativeColor,
                  }}
                >
                  ${formattedStringNumber(ExpenseByMonth[month] ?? 0)}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>

        {/* Summary Footer */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          pt={2}
          mt={1}
          sx={{
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography fontWeight={700} fontSize="1.1rem">
            {selectedYear === currentYear && "YTD "}
            {selectedYear}
          </Typography>

          <Stack direction="row" spacing={6}>
            <Typography
              fontWeight={700}
              fontSize="1.1rem"
              minWidth={90}
              textAlign="right"
              sx={{
                color: positiveColor,
              }}
            >
              ${formattedStringNumber(yearIncomeTotal)}
            </Typography>

            <Typography
              fontWeight={700}
              fontSize="1.1rem"
              minWidth={90}
              textAlign="right"
              sx={{
                color: negativeColor,
              }}
            >
              ${formattedStringNumber(yearExpenseTotal)}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </ShowCaseCard>
  )
}

export default TransactionTotals
