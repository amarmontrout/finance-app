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
import { buildMultiColumnData, MultiColumnDataType } from "@/utils/buildChartData"
import getChoices from "@/utils/getChoices"
import { getMonthTotal } from "@/utils/getTotals"
import { Box } from "@mui/material"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

const Income = () => {
  const { 
    incomeTransactions, 
    refreshIncomeTransactions,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    incomeCategories
  } = useTransactionContext()

  const pathname = usePathname()

  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string>("")
  const [lineChartData, setLineChartData] = useState<MultiColumnDataType>([])
  const [hasChoices, setHasChoices] = useState<boolean>(false)
  
  const monthTotal = getMonthTotal(selectedYear, selectedMonth, incomeTransactions)
  const theme = useTheme()
  const currentTheme = theme.theme
    
  useEffect(() => {
    refreshIncomeTransactions()
    const yearsChoices = getChoices({key: YEARS_KEY})
    const incomeChoices = getChoices({key: INCOME_CATEGORIES_KEY})
    if (yearsChoices.length !== 0 && incomeChoices.length !== 0) {
      setHasChoices(true)
    }
  }, [])

  const buildIncomeChartData = () => {
    const chartData = buildMultiColumnData({
      firstData: incomeTransactions,
      firstColumnTitle: "Month",
      method: "self"
    })

    if (!chartData) return

    setLineChartData(chartData)
  }

  useEffect(() => {
    buildIncomeChartData()
  }, [incomeTransactions])

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
        <ShowCaseCard title={`Income for ${selectedMonth} ${selectedYear}`} secondaryTitle={`Total $${monthTotal}`}>
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
            height="400px"
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
      />
    </Box>
  )
}

export default Income