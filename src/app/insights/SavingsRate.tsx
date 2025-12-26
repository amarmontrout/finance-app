"use client"

import ColoredInfoCard from "@/components/ColoredInfoCard"
import { FlexColWrapper, FlexRowWrapper } from "@/components/Wrappers"
import { useTransactionContext } from "@/contexts/transactions-context"
import { healthStateDarkMode, healthStateLightMode } from "@/globals/colors"
import { useSavingsRateData } from "@/hooks/useSavingsRateData"
import {
  formattedStringNumber, 
  getPreviousMonthInfo, 
  getSavingsHealthState 
} from "@/utils/helperFunctions"
import { useTheme } from "next-themes"

const SavingsRate = (props: {
  selectedYear: string
  selectedMonth: string
  view: "annual" | "month"
}) => {
  const { selectedYear, selectedMonth, view } = props

  const {
    incomeTransactions,
    expenseTransactions
  } = useTransactionContext()
  const { theme: currentTheme } = useTheme()
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

  const monthSavingsColor = (currentTheme === "light"
    ? healthStateLightMode
    : healthStateDarkMode)[monthSavingsHealthState]
  const annualSavingsColor = (currentTheme === "light"
    ? healthStateLightMode
    : healthStateDarkMode)[annualSavingsHealthState]
  const defaultColor = (currentTheme === "light"
    ? healthStateLightMode
    : healthStateDarkMode)["default"]

  return (
    <FlexColWrapper gap={3}>
      {view === "month" &&
        <FlexColWrapper gap={3}>
          <ColoredInfoCard
            cardColors={monthSavingsColor}
            title={`${selectedMonth} ${selectedYear} 
              State: ${monthSavingsHealthState}`}
            info={`${formattedStringNumber(monthRate)}%`}
          />

          <FlexColWrapper gap={3} toRowBreak={"sm"}>
            <ColoredInfoCard
              cardColors={defaultColor}
              title={`Compared to last month:`}
              info={`${formattedStringNumber(diffs.monthOverMonth)}%`}
            />

            <ColoredInfoCard
              cardColors={defaultColor}
              title={`Compared to ${prevMonthYear}:`}
              info={`${formattedStringNumber(diffs.monthVsAnnual)}%`}
            />            
          </FlexColWrapper>
        </FlexColWrapper>
      }

      {view === "annual" &&
      <FlexColWrapper gap={3}>
        <ColoredInfoCard
          cardColors={annualSavingsColor}
          title={`${selectedYear} State: ${annualSavingsHealthState}`}
          info={`${formattedStringNumber(annualRate)}%`}
        />

        <ColoredInfoCard
          cardColors={defaultColor}
          title={`Compared to ${previousYear}:`}
          info={`${formattedStringNumber(diffs.yearOverYear)}%`}
        />
      </FlexColWrapper>
      }
    </FlexColWrapper>
  )
}

export default SavingsRate