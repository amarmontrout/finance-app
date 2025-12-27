"use client"

import 
  EditTransactionDetailDialog 
from "@/components/EditTransactionDetailDialog"
import LineChart from "@/components/LineChart"
import MockDataWarning from "@/components/MockDataWarning"
import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionForm from "@/components/TransactionForm"
import TransactionsList from "@/components/TransactionsList"
import { FlexColWrapper } from "@/components/Wrappers"
import { useTransactionContext } from "@/contexts/transactions-context"
import { incomeLinesLight, incomeLinesDark } from "@/globals/colors"
import { INCOME, INCOME_CATEGORIES_KEY, YEARS_KEY } from "@/globals/globals"
import { buildMultiColumnData } from "@/utils/buildChartData"
import { getChoices } from "@/utils/choiceStorage"
import { getMonthTotal } from "@/utils/getTotals"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import { Box } from "@mui/material"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { useState, useEffect, useMemo } from "react"

const Income = () => {
  const { 
    incomeTransactions, 
    refreshIncomeTransactions,
    incomeCategories
  } = useTransactionContext()

  useEffect(() => {
    refreshIncomeTransactions()
  }, [])

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
  const monthIncome = useMemo(() => {
    return getMonthTotal(selectedYear, selectedMonth, incomeTransactions)
  }, [selectedYear, selectedMonth, incomeTransactions])
  const lineChartData = useMemo(() => {
    return buildMultiColumnData({
      firstData: incomeTransactions,
      firstColumnTitle: "Month",
      method: "self"
    }) ?? []
  }, [incomeTransactions])

  return (
    <FlexColWrapper gap={2}>
      <MockDataWarning pathname={pathname}/>

      {hasChoices &&
        <Box>
          <ShowCaseCard title={"Add Income"}>
            <TransactionForm
              categories={incomeCategories}
              type={INCOME}
              refreshTransactions={refreshIncomeTransactions}
            />
          </ShowCaseCard>
        </Box>
      }

      <FlexColWrapper gap={2} toRowBreak={"xl"}>
        <ShowCaseCard 
          title={`Income for ${selectedMonth} ${selectedYear}`} 
          secondaryTitle={`$${monthIncome}`}
        >
          <TransactionsList
            type={INCOME}
            transactions={incomeTransactions}
            refreshTransactions={refreshIncomeTransactions}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            setOpenEditDialog={setOpenEditDialog}
            setSelectedId={setSelectedId}
          />
        </ShowCaseCard>
        
        <ShowCaseCard title={"Income Chart"}>
          <LineChart
            multiColumnData={lineChartData}
            lineColors={
              currentTheme === "light" 
              ? incomeLinesLight
              : incomeLinesDark
            }
          />
        </ShowCaseCard>
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
      />
    </FlexColWrapper>
  )
}

export default Income