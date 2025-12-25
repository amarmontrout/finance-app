"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import { useTransactionContext } from "@/contexts/transactions-context"
import { Box } from "@mui/material"
import { useEffect, useState } from "react"
import NetCashFlow from "./NetCashFlow"
import SavingsRate from "./SavingsRate"
import MockDataWarning from "@/components/MockDataWarning"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import DateSelector from "@/components/DateSelector"

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
    <Box
      className="flex flex-col gap-2 h-full"
    >
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
      
      <Box
        className="flex flex-col 2xl:flex-row gap-2 h-full"
      >
        <Box
          className="flex flex-1 min-w-0"
        >
          <ShowCaseCard title={"Net Cash Flow"}>
            <NetCashFlow
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              view={view}
            />
          </ShowCaseCard>
        </Box>

        <Box
          className="flex flex-1 flex-col gap-2 h-full"
        >
          <ShowCaseCard title={"Savings Rate"}>
            <SavingsRate
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              view={view}
            />
          </ShowCaseCard>
        </Box>
      </Box>
    </Box>
  )
}

export default Insights