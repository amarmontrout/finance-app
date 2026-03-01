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
            <Typography fontWeight={700} color="success.main">
              Income
            </Typography>
            <Typography fontWeight={700} color="error.main">
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
                  color="success.main"
                  textAlign="right"
                  minWidth={90}
                >
                  ${formattedStringNumber(incomeByMonth[month] ?? 0)}
                </Typography>

                <Typography
                  fontWeight={500}
                  color="error.main"
                  textAlign="right"
                  minWidth={90}
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
              color="success.main"
              minWidth={90}
              textAlign="right"
            >
              ${formattedStringNumber(yearIncomeTotal)}
            </Typography>

            <Typography
              fontWeight={700}
              fontSize="1.1rem"
              color="error.main"
              minWidth={90}
              textAlign="right"
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
