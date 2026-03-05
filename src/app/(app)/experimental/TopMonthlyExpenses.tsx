import ColoredInfoCard from "@/components/ColoredInfoCard"
import LoadingCircle from "@/components/LoadingCircle"
import ShowCaseCard from "@/components/ShowCaseCard"
import { FlexColWrapper } from "@/components/Wrappers"
import { formattedStringNumber, getCardColor } from "@/utils/helperFunctions"
import { Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { getMonthCategoryTotals } from "./functions"
import { NewTransactionType } from "@/utils/type"

const TopMonthlyExpenses = ({
  transactions,
  currentMonth,
  currentYear,
  currentTheme,
  isLoading,
}: {
  transactions: NewTransactionType[]
  currentMonth: string
  currentYear: number
  currentTheme: string | undefined
  isLoading: boolean
}) => {
  const defaultCardColor = getCardColor(currentTheme, "default")
  const topThreeData = useMemo(() => {
    const monthExpenseCategoryTotals = getMonthCategoryTotals(
      currentYear,
      currentMonth,
      transactions,
    )
    if (!monthExpenseCategoryTotals || monthExpenseCategoryTotals.length <= 1) {
      return {
        topThree: [] as [string, number][],
        topThreeSum: 0,
        monthTotal: 0,
        topThreeTotalPercent: 0,
      }
    }
    const topThree = monthExpenseCategoryTotals
      .slice(1)
      .sort((a, b) => Number(b[1]) - Number(a[1]))
      .slice(0, 3) as [string, number][]
    const topThreeSum = topThree.reduce((sum, [, amount]) => sum + amount, 0)
    return {
      topThree,
      topThreeSum,
    }
  }, [currentYear, currentMonth, transactions])

  const { topThree, topThreeSum } = topThreeData

  return (
    <ShowCaseCard title={`Top Monthly Expenses V2`}>
      {isLoading ? (
        <LoadingCircle />
      ) : (
        <Stack spacing={2}>
          <FlexColWrapper gap={2} toRowBreak={"xl"}>
            {topThree.map(([category, amount], idx) => (
              <ColoredInfoCard
                key={category}
                cardColors={defaultCardColor}
                info={`$${formattedStringNumber(Number(amount))}`}
                title={`${idx + 1}) ${category}`}
              />
            ))}
          </FlexColWrapper>
          {topThree.length !== 0 ? (
            <Typography variant={"h6"} width={"100%"} textAlign={"center"}>
              {`A total of $${formattedStringNumber(topThreeSum)}`}
            </Typography>
          ) : (
            <Typography width={"100%"} textAlign={"center"}>
              Enter your expenses in transactions
            </Typography>
          )}
        </Stack>
      )}
    </ShowCaseCard>
  )
}

export default TopMonthlyExpenses
