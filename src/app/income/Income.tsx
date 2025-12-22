"use client"

import EditTransactionDetailDialog from "@/components/EditTransactionDetailDialog"
import LineChart from "@/components/LineChart"
import MockDataWarning from "@/components/MockDataWarning"
import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionForm from "@/components/TransactionForm"
import TransactionsList from "@/components/TransactionsList"
import { useTransactionContext } from "@/contexts/transactions-context"
import { incomeLinesLight, incomeLinesDark } from "@/globals/colors"
import { INCOME, INCOME_CATEGORIES_KEY, YEARS_KEY } from "@/globals/globals"
import { buildMultiColumnData } from "@/utils/buildChartData"
import getChoices from "@/utils/getChoices"
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

  const pathname = usePathname()

  const { currentYear, currentMonth } = getCurrentDateInfo()

  const [selectedYear, setSelectedYear] = useState<string>(currentYear)
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth)
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string>("")
  const [hasChoices, setHasChoices] = useState<boolean>(false)
  
  const monthTotal = useMemo(() => {
    return getMonthTotal(selectedYear, selectedMonth, incomeTransactions)
  }, [selectedYear, selectedMonth, incomeTransactions])

  const { theme: currentTheme } = useTheme()

  const lineChartData = useMemo(() => {
    return buildMultiColumnData({
      firstData: incomeTransactions,
      firstColumnTitle: "Month",
      method: "self"
    }) ?? []
  }, [incomeTransactions])
  
  useEffect(() => {
    refreshIncomeTransactions()

    const hasData = getChoices({key: YEARS_KEY}).length !== 0
      && getChoices({key: INCOME_CATEGORIES_KEY}).length !== 0
    setHasChoices(hasData)
  }, [])

  return (
    <Box
      className="flex flex-col gap-2 h-full"
    >
      <MockDataWarning pathname={pathname}/>

      <Box display={hasChoices? "flex" : "none"}>
        <ShowCaseCard title={"Add Income"}>
          <TransactionForm
            categories={incomeCategories}
            type={INCOME}
            refreshTransactions={refreshIncomeTransactions}
          />
        </ShowCaseCard>
      </Box>

      <Box
        className="flex flex-col xl:flex-row gap-2 h-full"
      >
        <ShowCaseCard 
          title={`Income for ${selectedMonth} ${selectedYear}`} 
          secondaryTitle={`Total $${monthTotal}`}
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
            title={"Income"}
            lineColors={
              currentTheme === "light" 
              ? incomeLinesLight
              : incomeLinesDark
            }
          />
        </ShowCaseCard>
      </Box>

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
    </Box>
  )
}

export default Income