import ColoredInfoCard from "@/components/ColoredInfoCard"
import ShowCaseCard from "@/components/ShowCaseCard"
import { getNetCashFlow } from "@/utils/financialFunctions"
import { getYearTotal } from "@/utils/getTotals"
import { cleanNumber, getCardColor, getSavingsHealthState } from "@/utils/helperFunctions"
import { TransactionData } from "@/utils/transactionStorage"

const YearNetCash = ({
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
  const annualIncome = getYearTotal(currentYear, incomeTransactions, excludedSet)
  const annualExpense = getYearTotal(currentYear, expenseTransactions, excludedSet)
  const annualNetIncome = getNetCashFlow(annualIncome, annualExpense)

  const savingsHealthState = getSavingsHealthState(
    cleanNumber(annualNetIncome), 
    cleanNumber(annualIncome)
  )

  const savingsColor = getCardColor(currentTheme, savingsHealthState)

  return (
    <ShowCaseCard title={`${currentYear} Net Cash`}>
        <ColoredInfoCard
          cardColors={savingsColor}
          info={`Net Cash: $${annualNetIncome}`}
          title={`Net Cash Rating: ${savingsHealthState}`}
        />
    </ShowCaseCard>
  )
}

export default YearNetCash