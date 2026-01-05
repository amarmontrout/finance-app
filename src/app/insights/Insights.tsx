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
import { useCategoryContext } from "@/contexts/categories-context"
import { Divider } from "@mui/material"
import { darkMode, lightMode } from "@/globals/colors"
import { useTheme } from "next-themes"

const Insights = () => {
  const { 
    incomeTransactions,
    refreshIncomeTransactions,
    expenseTransactions,
    refreshExpenseTransactions
  } = useTransactionContext()
  const { years, excludedSet } = useCategoryContext()
  const { currentYear, currentMonth } = getCurrentDateInfo()
  const {theme: currentTheme} = useTheme()

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
      />

      <Divider
        className="flex w-full"
        sx={{ 
          borderColor: currentTheme === "light" ?
            lightMode.borderStrong 
            : darkMode.borderStrong,
          borderWidth: 1
        }}
      />

      <FlexColWrapper gap={2} toRowBreak={"2xl"}>
        <FlexChildWrapper>
          <ShowCaseCard title={"Net Cash Flow"}>
            <NetCashFlow
              incomeTransactions={incomeTransactions}
              expenseTransactions={expenseTransactions}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              view={view}
              currentTheme={currentTheme}
              excludedSet={excludedSet}
            />
          </ShowCaseCard>
        </FlexChildWrapper>

        <FlexChildWrapper>
          <ShowCaseCard title={"Savings Rate"}>
            <SavingsRate
              incomeTransactions={incomeTransactions}
              expenseTransactions={expenseTransactions}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              view={view}
              currentTheme={currentTheme}
            />
          </ShowCaseCard>
        </FlexChildWrapper>
      </FlexColWrapper>
    </FlexColWrapper>
  )
}

export default Insights