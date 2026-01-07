"use client"

import 
  EditTransactionDetailDialog 
from "@/components/EditTransactionDetailDialog"
import LineChart from "@/components/LineChart"
import MockDataWarning from "@/components/MockDataWarning"
import { FlexColWrapper } from "@/components/Wrappers"
import { useCategoryContext } from "@/contexts/categories-context"
import { useTransactionContext } from "@/contexts/transactions-context"
import { incomeLinesLight, incomeLinesDark } from "@/globals/colors"
import { INCOME, INCOME_CATEGORIES_KEY, YEARS_KEY } from "@/globals/globals"
import { buildMultiColumnData } from "@/utils/buildChartData"
import { getChoices } from "@/utils/choiceStorage"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import { Box } from "@mui/material"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { useState, useMemo } from "react"
import AddIncome from "./AddIncome"
import IncomeList from "./IncomeList"

const Income = () => {
  const { 
    incomeTransactions, 
    refreshIncomeTransactions,
  } = useTransactionContext()
  const { incomeCategories, years, excludedSet } = useCategoryContext()
  const pathname = usePathname()
  const { theme: currentTheme } = useTheme()
  const { currentYear, currentMonth } = getCurrentDateInfo()

  const [selectedYear, setSelectedYear] = useState<string>(currentYear)
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth)
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string>("")

  const hasChoices = useMemo(() => {
    return (
      getChoices({ key: YEARS_KEY }).length !== 0 &&
      getChoices({ key: INCOME_CATEGORIES_KEY }).length !== 0
    )
  }, [])

  const lineChartData = useMemo(() => {
    return buildMultiColumnData({
      firstData: incomeTransactions,
      firstColumnTitle: "Month",
      method: "self"
    }) ?? []
  }, [incomeTransactions])

  const lineColors = currentTheme === "light" 
    ? incomeLinesLight
    : incomeLinesDark

  return (
    <FlexColWrapper gap={2}>
      <MockDataWarning pathname={pathname}/>

      {hasChoices &&
        <Box>
          <AddIncome
            incomeCategories={incomeCategories}
            income={INCOME}
            refreshIncomeTransactions={refreshIncomeTransactions}
            years={years}
          />
        </Box>
      }

      <FlexColWrapper gap={2} toRowBreak={"xl"}>
        <IncomeList
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          income={INCOME}
          incomeTransactions={incomeTransactions}
          refreshIncomeTransactions={refreshIncomeTransactions}
          setOpenEditDialog={setOpenEditDialog}
          setSelectedId={setSelectedId}
          excludedSet={excludedSet}
        />
        
        <LineChart
          multiColumnData={lineChartData}
          lineColors={ lineColors }
        />
      </FlexColWrapper>

      <EditTransactionDetailDialog
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        type={INCOME}
        selectedId={selectedId}
        transactions={incomeTransactions}
        categories={incomeCategories}
        currentTheme={currentTheme}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        refreshIncomeTransactions={refreshIncomeTransactions}
      />
    </FlexColWrapper>
  )
}

export default Income