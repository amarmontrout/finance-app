import ColoredInfoCard from "@/components/ColoredInfoCard"
import LoadingCircle from "@/components/LoadingCircle"
import ShowCaseCard from "@/components/ShowCaseCard"
import { FlexColWrapper } from "@/components/Wrappers"
import {
  formattedStringNumber,
  getCardColor,
  getSavingsHealthState,
} from "@/utils/helperFunctions"
import { getTotalsForMonthNetCash } from "./functions"
import { getNetCashFlow } from "@/utils/financialFunctions"
import { NewTransactionType } from "@/utils/type"

const MonthlySummary = ({
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
  const { incomeTotalMonthNet, expenseTotalMonthNet } =
    getTotalsForMonthNetCash(currentYear, currentMonth, transactions)

  const annualNetIncome = getNetCashFlow(
    incomeTotalMonthNet,
    expenseTotalMonthNet,
  )
  const savingsHealthState = getSavingsHealthState(
    annualNetIncome,
    incomeTotalMonthNet,
  )
  const savingsColor = getCardColor(currentTheme, savingsHealthState)
  const hasNet = annualNetIncome !== 0
  const netTitle = `${currentMonth} Net Cash${
    hasNet ? ` (${savingsHealthState.toUpperCase()})` : ""
  }`
  return (
    <ShowCaseCard title={"Monthly Summary"}>
      {isLoading ? (
        <LoadingCircle />
      ) : (
        <FlexColWrapper gap={2} toRowBreak={"xl"}>
          <ColoredInfoCard
            cardColors={defaultCardColor}
            info={`$${formattedStringNumber(incomeTotalMonthNet)}`}
            title={`${currentMonth} Income`}
          />
          <ColoredInfoCard
            cardColors={defaultCardColor}
            info={`$${formattedStringNumber(expenseTotalMonthNet)}`}
            title={`${currentMonth} Expenses`}
          />
          <ColoredInfoCard
            cardColors={savingsColor}
            info={`$${formattedStringNumber(annualNetIncome)}`}
            title={netTitle}
          />
        </FlexColWrapper>
      )}
    </ShowCaseCard>
  )
}

export default MonthlySummary
