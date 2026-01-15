import ColoredInfoCard from "@/components/ColoredInfoCard"
import ShowCaseCard from "@/components/ShowCaseCard"
import { FlexColWrapper } from "@/components/Wrappers"
import { getYearTotal, getYearTotalV2 } from "@/utils/getTotals"
import { getCardColor } from "@/utils/helperFunctions"
import { TransactionData } from "@/utils/transactionStorage"
import { TransactionTypeV2 } from "@/utils/type"

const YearTotals = ({
  currentYear,
  currentTheme,
  incomeTransactions,
  expenseTransactions,
  excludedSet,
  incomeTransactionsV2,
  expenseTransactionsV2
}: {
  currentYear: string
  currentTheme: string | undefined
  incomeTransactions: TransactionData
  expenseTransactions: TransactionData
  excludedSet: Set<string>
  incomeTransactionsV2: TransactionTypeV2[]
  expenseTransactionsV2: TransactionTypeV2[]
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

      <FlexColWrapper gap={2} toRowBreak={"md"}>
        <ColoredInfoCard
          cardColors={defaultCardColor}
          info={`$${getYearTotalV2(Number(currentYear), incomeTransactionsV2, excludedSet)}`}
          title={`${currentYear} Total Income`}
        />
        <ColoredInfoCard
          cardColors={defaultCardColor}
          info={`$${getYearTotalV2(Number(currentYear), expenseTransactionsV2, excludedSet)}`}
          title={`${currentYear} Total Expenses`}
        />
      </FlexColWrapper>
    </ShowCaseCard>
  )
}

export default YearTotals