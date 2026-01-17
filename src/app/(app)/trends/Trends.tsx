"use client"

import MockDataWarning from "@/components/MockDataWarning"
import AverageExpenses from "./AverageExpenses"
import { FlexColWrapper } from "@/components/Wrappers"
import Projections from "./Projections"
import { useTransactionContext } from "@/contexts/transactions-context"
import { useTheme } from "next-themes"
import { useCategoryContext } from "@/contexts/categories-context"
import { getCurrentDateInfo } from "@/utils/helperFunctions"

const Trends =() => {
  const { expenseTransactionsV2 } = useTransactionContext()
  const { excludedSet, expenseCategoriesV2 } = useCategoryContext()
  const { theme: currentTheme } = useTheme()
  const { currentYear, currentMonth } = getCurrentDateInfo()
  
  return (
    <FlexColWrapper gap={2}>
      <MockDataWarning/>

      <AverageExpenses
        expenseTransactions={expenseTransactionsV2}
        expenseCategories={expenseCategoriesV2}
        currentTheme={currentTheme}
        currentYear={currentYear}
        currentMonth={currentMonth}
      />

      <Projections
        expenseTransactions={expenseTransactionsV2}
        currentTheme={currentTheme}
        expenseCategories={expenseCategoriesV2}
        excludedSet={excludedSet}
        currentYear={currentYear}
        currentMonth={currentMonth}  
      />
    </FlexColWrapper>
  )
}

export default Trends