"use client"

import AverageExpenses from "./AverageExpenses"
import { FlexColWrapper } from "@/components/Wrappers"
import Projections from "./Projections"
import { useTransactionContext } from "@/contexts/transactions-context"
import { useTheme } from "next-themes"
import { useCategoryContext } from "@/contexts/categories-context"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import { Box, Tab, Tabs } from "@mui/material"
import { useState } from "react"

const Trends =() => {
  const { expenseTransactionsV2 } = useTransactionContext()
  const { excludedSet, expenseCategoriesV2 } = useCategoryContext()
  const { theme: currentTheme } = useTheme()
  const { currentYear, currentMonth } = getCurrentDateInfo()

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
          <Tab label="Expense Averages"/>
          <Tab label="Annual Projection"/>
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <AverageExpenses
          expenseTransactions={expenseTransactionsV2}
          expenseCategories={expenseCategoriesV2}
          currentTheme={currentTheme}
          currentYear={currentYear}
          currentMonth={currentMonth}
        />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Projections
          expenseTransactions={expenseTransactionsV2}
          currentTheme={currentTheme}
          expenseCategories={expenseCategoriesV2}
          excludedSet={excludedSet}
          currentYear={currentYear}
          currentMonth={currentMonth}  
        />
      </TabPanel>
    </FlexColWrapper>
  )
}

export default Trends