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
import { Box, Tab, Tabs } from "@mui/material"
import { useTheme } from "next-themes"
import { useState, useMemo } from "react"
import AddIncome from "./AddIncome"
import IncomeList from "./IncomeList"
import ShowCaseCard from "@/components/ShowCaseCard"

const Income = () => {
  const {
    incomeTransactionsV2,
    refreshIncomeTransactionsV2
  } = useTransactionContext()
  const { excludedSet, incomeCategoriesV2, yearsV2 } = useCategoryContext()
  const { theme: currentTheme } = useTheme()
  const { currentYear, currentMonth } = getCurrentDateInfo()

  const [selectedYear, setSelectedYear] = useState<string>(currentYear)
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth)
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [value, setValue] = useState(0)

  const { lineChartData, lineColors } = useMemo(() => {
    const lineChartData = buildMultiColumnDataV2({
      firstData: incomeTransactionsV2,
      firstColumnTitle: "Month",
      method: "self",
      excludedSet: excludedSet
    })
    const lineColors = currentTheme === "light" 
      ? incomeLinesLight
      : incomeLinesDark
    return { lineChartData, lineColors }
  }, [incomeTransactionsV2, currentTheme])

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
          <Tab label="Add Income"/>
          <Tab label="Income List"/>
          <Tab label="Income Chart"/>
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <AddIncome
          incomeCategories={incomeCategoriesV2}
          income={INCOME}
          refreshIncomeTransactions={refreshIncomeTransactionsV2}
          years={yearsV2}
        />
      </TabPanel>

      <TabPanel value={value} index={1}>
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
      </TabPanel>

      <TabPanel value={value} index={2}>
        <ShowCaseCard title={"Income"}>
          <LineChart
            multiColumnData={lineChartData}
            lineColors={lineColors}
          />
        </ShowCaseCard>
      </TabPanel>

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