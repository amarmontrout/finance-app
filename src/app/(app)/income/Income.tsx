"use client"

import 
  EditTransactionDetailDialog 
from "@/components/EditTransactionDetailDialog"
import LineChart from "@/components/LineChart"
import { FlexColWrapper } from "@/components/Wrappers"
import { useCategoryContext } from "@/contexts/categories-context"
import { useTransactionContext } from "@/contexts/transactions-context"
import { incomeLinesLight, incomeLinesDark } from "@/globals/colors"
import { INCOME } from "@/globals/globals"
import { buildMultiColumnDataV2 } from "@/utils/buildChartData"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import { Box } from "@mui/material"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { useState, useMemo } from "react"
import AddIncome from "./AddIncome"
import IncomeList from "./IncomeList"
import ShowCaseCard from "@/components/ShowCaseCard"

const Income = () => {
  const {
    incomeTransactionsV2,
    refreshIncomeTransactionsV2
  } = useTransactionContext()
  const {
    excludedSet,
    incomeCategoriesV2,
    yearsV2
  } = useCategoryContext()
  const pathname = usePathname()
  const { theme: currentTheme } = useTheme()
  const { currentYear, currentMonth } = getCurrentDateInfo()

  const [selectedYear, setSelectedYear] = useState<string>(currentYear)
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth)
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const lineChartData = useMemo(() => {
    return buildMultiColumnDataV2({
      firstData: incomeTransactionsV2,
      firstColumnTitle: "Month",
      method: "self",
      excludedSet: excludedSet
    })
  }, [incomeTransactionsV2])

  const lineColors = currentTheme === "light" 
    ? incomeLinesLight
    : incomeLinesDark

  return (
    <FlexColWrapper gap={2}>
      {incomeCategoriesV2.length !== 0 &&
        <Box>
          <AddIncome
            incomeCategories={incomeCategoriesV2}
            income={INCOME}
            refreshIncomeTransactions={refreshIncomeTransactionsV2}
            years={yearsV2}
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
          incomeTransactions={incomeTransactionsV2}
          refreshIncomeTransactions={refreshIncomeTransactionsV2}
          setOpenEditDialog={setOpenEditDialog}
          setSelectedId={setSelectedId}
          excludedSet={excludedSet}
        />

        <ShowCaseCard title={"Income"}>
          <LineChart
            multiColumnData={lineChartData}
            lineColors={lineColors}
          />
        </ShowCaseCard>
      </FlexColWrapper>

      <EditTransactionDetailDialog
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        type={INCOME}
        selectedId={selectedId}
        transactions={incomeTransactionsV2}
        categories={incomeCategoriesV2}
        currentTheme={currentTheme}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        refreshIncomeTransactions={refreshIncomeTransactionsV2}
      />
    </FlexColWrapper>
  )
}

export default Income