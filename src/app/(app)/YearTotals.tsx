import ColoredInfoCard from "@/components/ColoredInfoCard"
import ShowCaseCard from "@/components/ShowCaseCard"
import { FlexColWrapper } from "@/components/Wrappers"
import { getNetCashFlow } from "@/utils/financialFunctions"
import { getMonthTotalV2 } from "@/utils/getTotals"
import {
  cleanNumber,
  getCardColor,
  getSavingsHealthState,
} from "@/utils/helperFunctions"
import { TransactionTypeV2 } from "@/utils/type"

const YearTotals = ({
  currentYear,
  currentMonth,
  currentTheme,
  excludedSet,
  incomeTransactionsV2,
  expenseTransactionsV2,
}: {
  currentYear: number
  currentMonth: string
  currentTheme: string | undefined
  excludedSet: Set<string>
  incomeTransactionsV2: TransactionTypeV2[]
  expenseTransactionsV2: TransactionTypeV2[]
}) => {
  const defaultCardColor = getCardColor(currentTheme, "default")
  const totalIncome = getMonthTotalV2(
    currentYear,
    currentMonth,
    incomeTransactionsV2,
    excludedSet,
  )
  const totalExpenses = getMonthTotalV2(
    currentYear,
    currentMonth,
    expenseTransactionsV2,
    excludedSet,
  )
  const annualNetIncome = getNetCashFlow(totalIncome, totalExpenses)
  const savingsHealthState = getSavingsHealthState(
    cleanNumber(annualNetIncome),
    cleanNumber(totalIncome),
  )
  const savingsColor = getCardColor(currentTheme, savingsHealthState)
  const hasNet = Number(annualNetIncome) !== 0
  const netTitle = `${currentMonth} Net Cash${
    hasNet ? ` (${savingsHealthState.toUpperCase()})` : ""
  }`

  return (
    <ShowCaseCard title={"Monthly Summary"}>
      <FlexColWrapper gap={2} toRowBreak={"md"}>
        <ColoredInfoCard
          cardColors={defaultCardColor}
          info={`$${totalIncome}`}
          title={`${currentMonth} Income`}
        />
        <ColoredInfoCard
          cardColors={defaultCardColor}
          info={`$${totalExpenses}`}
          title={`${currentMonth} Expenses`}
        />
        <ColoredInfoCard
          cardColors={savingsColor}
          info={`$${annualNetIncome}`}
          title={netTitle}
        />
      </FlexColWrapper>
    </ShowCaseCard>
  )
}

export default YearTotals
