"use client"

import ColoredInfoCard from "@/components/ColoredInfoCard"
import { FlexColWrapper } from "@/components/Wrappers"
import { useSavingsRateData } from "@/hooks/useSavingsRateData"
import {
  formattedStringNumber, 
  getCardColor, 
  getPreviousMonthInfo, 
  getSavingsHealthState 
} from "@/utils/helperFunctions"
import { TransactionData } from "@/utils/transactionStorage"

const SavingsRate = ({
  incomeTransactions,
  expenseTransactions,
  selectedYear,
  selectedMonth,
  view,
  currentTheme
}: {
  incomeTransactions: TransactionData
  expenseTransactions: TransactionData
  selectedYear: string
  selectedMonth: string
  view: "annual" | "month"
  currentTheme: string | undefined
}) => {
  const { year: prevMonthYear, month: prevMonth } =
    getPreviousMonthInfo(selectedYear, selectedMonth)
  const previousYear = String(Number(selectedYear) - 1)
  const {
    monthRate,
    annualRate,
    diffs
  } = useSavingsRateData(
    selectedYear,
    selectedMonth,
    incomeTransactions,
    expenseTransactions,
    prevMonthYear,
    prevMonth
  )

  const monthSavingsHealthState = getSavingsHealthState(monthRate, 100)
  const annualSavingsHealthState = getSavingsHealthState(annualRate, 100)

  const monthSavingsColor = getCardColor(currentTheme, monthSavingsHealthState)
  const annualSavingsColor = getCardColor(currentTheme, annualSavingsHealthState)
  const defaultColor = getCardColor(currentTheme, "default")

  return (
    <FlexColWrapper gap={3}>
      {view === "month" &&
        <FlexColWrapper gap={3}>
          <ColoredInfoCard
            cardColors={monthSavingsColor}
            title={`${selectedMonth} ${selectedYear} 
              Savings Rating: ${monthSavingsHealthState}`}
            info={`Savings Rate: ${formattedStringNumber(monthRate)}%`}
          />

          <FlexColWrapper gap={3} toRowBreak={"sm"}>
            <ColoredInfoCard
              cardColors={defaultColor}
              title={`Compared to Last Month`}
              info={`${formattedStringNumber(diffs.monthOverMonth)}%`}
            />

            <ColoredInfoCard
              cardColors={defaultColor}
              title={`Compared to ${prevMonthYear}`}
              info={`${formattedStringNumber(diffs.monthVsAnnual)}%`}
            />            
          </FlexColWrapper>
        </FlexColWrapper>
      }

      {view === "annual" &&
      <FlexColWrapper gap={3}>
        <ColoredInfoCard
          cardColors={annualSavingsColor}
          title={`${selectedYear} Savings Rating: ${annualSavingsHealthState}`}
          info={`Savings Rate: ${formattedStringNumber(annualRate)}%`}
        />

        <ColoredInfoCard
          cardColors={defaultColor}
          title={`Compared to ${previousYear}`}
          info={`${formattedStringNumber(diffs.yearOverYear)}%`}
        />
      </FlexColWrapper>
      }
    </FlexColWrapper>
  )
}

export default SavingsRate