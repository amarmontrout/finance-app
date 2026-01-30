"use client"

import LineChart from "@/components/LineChart"
import { FlexColWrapper } from "@/components/Wrappers"
import { useCategoryContext } from "@/contexts/categories-context"
import { useTransactionContext } from "@/contexts/transactions-context"
import { darkMode, lightMode } from "@/globals/colors"
import { buildMultiColumnDataV2 } from "@/utils/buildChartData"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import { useTheme } from "next-themes"
import { useMemo, useState } from "react"
import YearTotals from "./YearTotals"
import YearNetCash from "./YearNetCash"
import { Box, Tab, Tabs } from "@mui/material"

const Overview = () => {
  const { 
    incomeTransactionsV2, 
    expenseTransactionsV2 
  } = useTransactionContext()
  const { excludedSet } = useCategoryContext()
  const { currentYear} = getCurrentDateInfo()
  const { theme: currentTheme } = useTheme()

  const [value, setValue] = useState(0)

  const lineColor = currentTheme === "light" 
    ? [lightMode.success, lightMode.error] 
    : [darkMode.success, darkMode.error]
  const chartDataV2 = useMemo(() => {
    return buildMultiColumnDataV2({
      firstData: incomeTransactionsV2,
      secondData: expenseTransactionsV2,
      selectedYear: Number(currentYear),
      firstColumnTitle: "Month",
      method: "compare",
      excludedSet: excludedSet
    })
  }, [incomeTransactionsV2, expenseTransactionsV2])

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
          <Tab label="Annual Totals"/>
          <Tab label="Annual Net Cash"/>
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <YearTotals
          currentYear={Number(currentYear)}
          currentTheme={currentTheme}
          excludedSet={excludedSet}
          incomeTransactionsV2={incomeTransactionsV2}
          expenseTransactionsV2={expenseTransactionsV2}
        />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <YearNetCash
          currentYear={Number(currentYear)}
          currentTheme={currentTheme}
          excludedSet={excludedSet}
          incomeTransactionsV2={incomeTransactionsV2}
          expenseTransactionsV2={expenseTransactionsV2}
        />
      </TabPanel>

      <LineChart
        multiColumnData={chartDataV2}
        lineColors={lineColor}
      /> 
    </FlexColWrapper>
  )
}

export default Overview