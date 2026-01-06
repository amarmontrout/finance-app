import ColoredInfoCard from "@/components/ColoredInfoCard"
import ShowCaseCard from "@/components/ShowCaseCard"
import { FlexColWrapper } from "@/components/Wrappers"
import { getYearTotal } from "@/utils/getTotals"
import { getCardColor } from "@/utils/helperFunctions"
import { TransactionData } from "@/utils/transactionStorage"

const YearTotals = ({
  currentYear,
  currentTheme,
  incomeTransactions,
  expenseTransactions,
  excludedSet
}: {
  currentYear: string
  currentTheme: string | undefined
  incomeTransactions: TransactionData
  expenseTransactions: TransactionData
  excludedSet: Set<string>
}) => {
  const defaultCardColor = getCardColor(currentTheme, "default")

  return (
    <ShowCaseCard title={`${currentYear} Totals`}>
      <FlexColWrapper gap={2} toRowBreak={"md"}>
        <ColoredInfoCard
          cardColors={defaultCardColor}
          info={`$${getYearTotal(currentYear, incomeTransactions, excludedSet)}`}
          title={`${currentYear} Total Income`}
        />
        <ColoredInfoCard
          cardColors={defaultCardColor}
          info={`$${getYearTotal(currentYear, expenseTransactions, excludedSet)}`}
          title={`${currentYear} Total Expenses`}
        />
      </FlexColWrapper>
    </ShowCaseCard>
  )
}

export default YearTotals