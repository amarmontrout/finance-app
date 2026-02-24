import ShowCaseCard from "@/components/ShowCaseCard"
import { MONTHS } from "@/globals/globals"
import { getYearTotalV2 } from "@/utils/getTotals"
import { formattedStringNumber } from "@/utils/helperFunctions"
import { TransactionTypeV2 } from "@/utils/type"
import { Stack, Typography } from "@mui/material"
import { useMemo } from "react"

const TransactionTotals = ({
  selectedYear,
  incomeTransactionsV2,
  expenseTransactionsV2,
  excludedSet
}: {
  selectedYear: number
  incomeTransactionsV2: TransactionTypeV2[]
  expenseTransactionsV2: TransactionTypeV2[]
  excludedSet: Set<string>
}) => {
  const yearIncomeTotal = useMemo(() => {
    return getYearTotalV2(
        selectedYear, 
        incomeTransactionsV2,
        excludedSet
      )
  }, [selectedYear, incomeTransactionsV2, excludedSet])

  const yearExpenseTotal = useMemo(() => {
     return getYearTotalV2(
        selectedYear, 
        expenseTransactionsV2,
        excludedSet
      )
  }, [selectedYear, expenseTransactionsV2, excludedSet])

  return (
    <ShowCaseCard 
      title={`Totals for ${selectedYear}`}
    >
      <Stack direction={"row"} width={"100%"}>
        <Stack direction={"column"} width={"34%"}>
          <Typography>{selectedYear}</Typography>
          {
            MONTHS.map((month) => {
              return (
                <Typography key={month}>{month}</Typography>
              )
            })
          }
        </Stack>
        <Stack direction={"column"} width={"33%"}>
          <Typography>{`+ $${yearIncomeTotal}`}</Typography>
          {
            MONTHS.map((month) => {
              const total = incomeTransactionsV2.reduce((acc, income) => {
                if (
                  income.month === month &&
                  income.year === selectedYear &&
                  !excludedSet.has(income.category)
                ) {
                  return acc + income.amount
                }
                return acc
              }, 0)
              return (
                <Typography key={`${month}-${total}`} color={"success"}>
                  {`+  $${formattedStringNumber(total)}`}
                </Typography>
              )
            })
          }
        </Stack>
        <Stack direction={"column"} width={"33%"}>
          <Typography>{`- $${yearExpenseTotal}`}</Typography>
          {
            MONTHS.map((month) => {
              const total = expenseTransactionsV2.reduce((acc, expense) => {
                if (
                  expense.month === month &&
                  expense.year === selectedYear &&
                  !excludedSet.has(expense.category)
                ) {
                  return acc + expense.amount
                }
                return acc
              }, 0)
              return (
                <Typography key={`${month}-${total}`} color={"error"}>
                  {`-  $${formattedStringNumber(total)}`}
                </Typography>
              )
            })
          }
        </Stack>
      </Stack>
    </ShowCaseCard>
  )
}

export default TransactionTotals