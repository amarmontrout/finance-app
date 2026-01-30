"use client"

import { useTransactionContext } from "@/contexts/transactions-context"
import { useState } from "react"
import NetCashFlow from "./NetCashFlow"
import SavingsRate from "./SavingsRate"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import DateSelector from "@/components/DateSelector"
import { FlexColWrapper } from "@/components/Wrappers"
import { useCategoryContext } from "@/contexts/categories-context"
import { Box, Divider, Tab, Tabs } from "@mui/material"
import { darkMode, lightMode } from "@/globals/colors"
import { useTheme } from "next-themes"

const Insights = () => {
  const { 
    incomeTransactionsV2,
    expenseTransactionsV2
  } = useTransactionContext()
  const { excludedSet, yearsV2 } = useCategoryContext()
  const { currentYear, currentMonth } = getCurrentDateInfo()
  const {theme: currentTheme} = useTheme()

  const [selectedYear, setSelectedYear] = useState<string>(currentYear)
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth)
  const [view, setView] = useState<"annual" | "month">("month")
  const [value, setValue] = useState(0)

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  }
  
  const TabPanel = ({ 
    children, 
    value, 
    index, 
    ...other 
  }: {
    children?: React.ReactNode
    index: number
    value: number
  }) => {
    return (
      <div hidden={value !== index} {...other} >
        {
          value === index 
            && <Box>{children}</Box>
        }
      </div>
    )
  }

  return (
    <FlexColWrapper gap={2}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Net Cash Flow"/>
          <Tab label="Savings Rate"/>
        </Tabs>
      </Box>

      <DateSelector
        view={view}
        setView={setView}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        years={yearsV2}
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

      <TabPanel value={value} index={0}>
        <NetCashFlow
          incomeTransactions={incomeTransactionsV2}
          expenseTransactions={expenseTransactionsV2}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          view={view}
          currentTheme={currentTheme}
          excludedSet={excludedSet}
        />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <SavingsRate
          incomeTransactions={incomeTransactionsV2}
          expenseTransactions={expenseTransactionsV2}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          view={view}
          currentTheme={currentTheme}
        />
      </TabPanel>
    </FlexColWrapper>
  )
}

export default Insights