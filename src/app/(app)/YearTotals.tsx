import ColoredInfoCard from "@/components/ColoredInfoCard"
import ShowCaseCard from "@/components/ShowCaseCard"
import { FlexColWrapper } from "@/components/Wrappers"
import { getYearTotalV2 } from "@/utils/getTotals"
import { getCardColor } from "@/utils/helperFunctions"
import { TransactionTypeV2 } from "@/utils/type"

const YearTotals = ({
  currentYear,
  currentTheme,
  excludedSet,
  incomeTransactionsV2,
  expenseTransactionsV2
}: {
  currentYear: number
  currentTheme: string | undefined
  excludedSet: Set<string>
  incomeTransactionsV2: TransactionTypeV2[]
  expenseTransactionsV2: TransactionTypeV2[]
}) => {
  const defaultCardColor = getCardColor(currentTheme, "default")
  const totalIncome = getYearTotalV2(
    currentYear, 
    incomeTransactionsV2, 
    excludedSet
  )
  const totalExpenses = getYearTotalV2(
    currentYear, 
    expenseTransactionsV2, 
    excludedSet
  )

  return (
    <ShowCaseCard title={`${currentYear} Totals`}>
      <FlexColWrapper gap={2} toRowBreak={"md"}>
        <ColoredInfoCard
          cardColors={defaultCardColor}
          info={`$${totalIncome}`}
          title={`${currentYear} Total Income`}
        />
        <ColoredInfoCard
          cardColors={defaultCardColor}
          info={`$${totalExpenses}`}
          title={`${currentYear} Total Expenses`}
        />
      </FlexColWrapper>
    </ShowCaseCard>
  )
}

export default YearTotals