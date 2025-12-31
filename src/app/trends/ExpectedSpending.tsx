import DiffColumnChart from "@/components/DiffColumnChart"
import ShowCaseCard from "@/components/ShowCaseCard"
import { useCategoryContext } from "@/contexts/categories-context"
import { useTransactionContext } from "@/contexts/transactions-context"
import { MONTHS } from "@/globals/globals"
import { buildTwoColumnData } from "@/utils/buildChartData"
import { getAverage } from "@/utils/financialFunctions"
import { 
  cleanNumber, 
  flattenTransactions, 
  getCurrentDateInfo 
} from "@/utils/helperFunctions"
import { Box } from "@mui/material"
import { useEffect, useMemo } from "react"

const ExpectedSpending = () => {
  const { 
    expenseTransactions,
    refreshExpenseTransactions
  } = useTransactionContext()
  const { 
    expenseCategories,
    refreshExpenseCategoryChoices 
  } = useCategoryContext()
  const { currentYear, currentMonth } = getCurrentDateInfo()

  useEffect(() => {
    refreshExpenseTransactions()
    refreshExpenseCategoryChoices()
  }, [])

  const { expectedAverage, realAmount } = useMemo(() => {
    const flattenedData = flattenTransactions(expenseTransactions)
    const passedMonths = MONTHS.indexOf(currentMonth) + 1

    const expectedAverage: [string, number][] = []
    const realAmount: [string, number][] = []

    expenseCategories.forEach((category) => {
      const currentMonthTotals: Record<string, number> = {}

      if (category.isRecurring) {
        flattenedData.forEach((t) => {
          if (
            t.category === category.name &&
            t.year === currentYear &&
            MONTHS.indexOf(t.month) + 1 <= passedMonths
          ) {
            currentMonthTotals[t.month] =
              (currentMonthTotals[t.month] ?? 0) + cleanNumber(t.amount)
          }
        })
  
        const currentAmounts = MONTHS
          .slice(0, passedMonths)
          .map((month) => currentMonthTotals[month] ?? 0)
          const actual = currentAmounts.at(-1) ?? 0
          const expected = getAverage(currentAmounts).toFixed(2)
    
          expectedAverage.push([category.name, Number(expected)])
          realAmount.push([category.name, actual])
      }
    })

    return { expectedAverage, realAmount }
  }, [expenseTransactions, expenseCategories, currentYear, currentMonth])  

  const expectedColumnData = useMemo(() => {
    return buildTwoColumnData({
      data: expectedAverage,
      firstColumnTitle: "Category",
      secondColumnTitle: "Expected"
    })
  }, [expectedAverage])

  const actualColumnData = useMemo(() => {
    return buildTwoColumnData({
      data: realAmount,
      firstColumnTitle: "Category",
      secondColumnTitle: "Actual"
    })
  }, [realAmount])

  return (
    <ShowCaseCard 
      title={`Expected VS Actual Spending`}
    >
      <Box>
        <DiffColumnChart
          oldData={expectedColumnData}
          newData={actualColumnData}
        />
      </Box>
    </ShowCaseCard>
  )
}

export default ExpectedSpending