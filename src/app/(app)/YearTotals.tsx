import ColoredInfoCard from "@/components/ColoredInfoCard"
import ShowCaseCard from "@/components/ShowCaseCard"
import { FlexColWrapper } from "@/components/Wrappers"
import { getNetCashFlow } from "@/utils/financialFunctions"
import { getYearUpToMonthTotalV2 } from "@/utils/getTotals"
import {
  cleanNumber,
  getCardColor,
  getSavingsHealthState,
} from "@/utils/helperFunctions"
import { TransactionTypeV2 } from "@/utils/type"

const YearTotals = ({
  currentYear,
  passedMonths,
  currentTheme,
  excludedSet,
  incomeTransactionsV2,
  expenseTransactionsV2,
}: {
  currentYear: number
  passedMonths: string[]
  currentTheme: string | undefined
  excludedSet: Set<string>
  incomeTransactionsV2: TransactionTypeV2[]
  expenseTransactionsV2: TransactionTypeV2[]
}) => {
  const defaultCardColor = getCardColor(currentTheme, "default")
  const totalIncome = getYearUpToMonthTotalV2(
    currentYear,
    passedMonths,
    incomeTransactionsV2,
    excludedSet,
  )
  const totalExpenses = getYearUpToMonthTotalV2(
    currentYear,
    passedMonths,
    expenseTransactionsV2,
    excludedSet,
  )
  const annualIncome = getYearUpToMonthTotalV2(
    currentYear,
    passedMonths,
    incomeTransactionsV2,
    excludedSet,
  )
  const annualExpense = getYearUpToMonthTotalV2(
    currentYear,
    passedMonths,
    expenseTransactionsV2,
    excludedSet,
  )
  const annualNetIncome = getNetCashFlow(annualIncome, annualExpense)
  const savingsHealthState = getSavingsHealthState(
    cleanNumber(annualNetIncome),
    cleanNumber(annualIncome),
  )
  const savingsColor = getCardColor(currentTheme, savingsHealthState)

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
        <ColoredInfoCard
          cardColors={savingsColor}
          info={`Net Cash: $${annualNetIncome}`}
          title={`Net Cash Rating: ${savingsHealthState}`}
        />
      </FlexColWrapper>
    </ShowCaseCard>
  )
}

export default YearTotals
