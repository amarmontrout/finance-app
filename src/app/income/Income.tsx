"use client"

import EditTransactionDetailDialog from "@/components/EditTransactionDetailDialog"
import LineChart from "@/components/LineChart"
import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionForm from "@/components/TransactionForm"
import TransactionsList from "@/components/TransactionsList"
import { useTransactionContext } from "@/contexts/transactions-context"
import { incomeLinesLight, incomeLinesDark } from "@/globals/colors"
import { INCOME } from "@/globals/globals"
import { Box } from "@mui/material"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

const Income = () => {
  const { 
    incomeTransactions, 
    refreshIncomeTransactions,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    getMonthIncomeTotal,
    incomeCategories
  } = useTransactionContext()

  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string>("")
  
  const monthTotal = getMonthIncomeTotal()
  const theme = useTheme()
  const currentTheme = theme.theme
    
  useEffect(() => {
    refreshIncomeTransactions()
  }, [])

  return (
    <Box
      className="flex flex-col gap-2 h-full"
    >
      <ShowCaseCard title={"Add Income"} secondaryTitle={""}>
        <TransactionForm
          categories={incomeCategories}
          type={INCOME}
          refreshTransactions={refreshIncomeTransactions}
        />
      </ShowCaseCard>

      <Box
        className="flex flex-col xl:flex-row gap-2 h-full"
      >
        <ShowCaseCard title={`Income for ${selectedMonth} ${selectedYear}`} secondaryTitle={`Total ${monthTotal}`}>
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
        
        <ShowCaseCard title={"Income Chart"} secondaryTitle={""}>
          <LineChart
            selectedYear={selectedYear}
            transactions={incomeTransactions}
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