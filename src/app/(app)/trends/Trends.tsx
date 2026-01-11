"use client"

import MockDataWarning from "@/components/MockDataWarning"
import AverageExpenses from "./AverageExpenses"
import { FlexColWrapper } from "@/components/Wrappers"
import Projections from "./Projections"
import ExpectedSpending from "./ExpectedSpending"
import { useTransactionContext } from "@/contexts/transactions-context"
import { useTheme } from "next-themes"
import { useCategoryContext } from "@/contexts/categories-context"
import { getCurrentDateInfo } from "@/utils/helperFunctions"

const Trends =() => {
  const { flatExpenseTransactions } = useTransactionContext()
  const { expenseCategories, excludedSet } = useCategoryContext()
  const { theme: currentTheme } = useTheme()
  const { currentYear, currentMonth } = getCurrentDateInfo()
  
  return (
    <FlexColWrapper gap={2}>
      <MockDataWarning/>

      <AverageExpenses
        flatExpenseTransactions={flatExpenseTransactions}
        expenseCategories={expenseCategories}
        currentTheme={currentTheme}
        currentYear={currentYear}
        currentMonth={currentMonth}
      />

      <Projections
        flatExpenseTransactions={flatExpenseTransactions}
        currentTheme={currentTheme}
        expenseCategories={expenseCategories}
        excludedSet={excludedSet}
        currentYear={currentYear}
        currentMonth={currentMonth}  
      />

      {/* <ExpectedSpending
        flatExpenseTransactions={flatExpenseTransactions}
        expenseCategories={expenseCategories}
        currentYear={currentYear}
        currentMonth={currentMonth}
      /> */}
    </FlexColWrapper>
  )
}

export default Trends