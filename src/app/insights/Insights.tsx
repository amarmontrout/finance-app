"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import { useTransactionContext } from "@/contexts/transactions-context"
import { useEffect, useState } from "react"
import NetCashFlow from "./NetCashFlow"
import SavingsRate from "./SavingsRate"
import MockDataWarning from "@/components/MockDataWarning"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import DateSelector from "@/components/DateSelector"
import { FlexChildWrapper, FlexColWrapper } from "@/components/Wrappers"

const Insights = () => {
  const { 
    years,
    refreshIncomeTransactions,
    refreshExpenseTransactions,
    isMockData
  } = useTransactionContext()

  const { currentYear, currentMonth } = getCurrentDateInfo()

  const [selectedYear, setSelectedYear] = useState<string>(currentYear)
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth)
  const [view, setView] = useState<"annual" | "month">("month")

  useEffect(() => {
    refreshIncomeTransactions()
    refreshExpenseTransactions()
  }, [])

  return (
    <FlexColWrapper gap={2}>
      <MockDataWarning/>

      <DateSelector
        view={view}
        setView={setView}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        years={years}
        isMockData={isMockData}
      />

      <hr style={{width: "100%"}}/>
      <FlexColWrapper gap={2} toRowBreak={"2xl"}>
        <FlexChildWrapper>
          <ShowCaseCard title={"Net Cash Flow"}>
            <NetCashFlow
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              view={view}
            />
          </ShowCaseCard>
        </FlexChildWrapper>

        <FlexChildWrapper>
          <ShowCaseCard title={"Savings Rate"}>
            <SavingsRate
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              view={view}
            />
          </ShowCaseCard>
        </FlexChildWrapper>
      </FlexColWrapper>
    </FlexColWrapper>
  )
}

export default Insights