"use client"

import { useTransactionContext } from "@/contexts/transactions-context"
import { useMemo, useState } from "react"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import { Box, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material"
import { negativeColor, neutralColor, positiveColor } from "@/globals/colors"
import BarChart from "@/components/BarChart"
import {
  buildMultiColumnData,
  buildTwoColumnData,
  TwoColumnDataType,
} from "@/utils/buildChartData"
import MonthYearSelector from "@/components/MonthYearSelector"
import { SelectedDateType } from "@/utils/type"
import { MONTHS } from "@/globals/globals"
import { getNetCashFlow } from "@/utils/financialFunctions"
import ShowCaseCard from "@/components/ShowCaseCard"
import { getTotalsForMonthNetCash } from "../experimental/functions"

const Insights = () => {
  const { transactions } = useTransactionContext()
  const { currentYear, currentMonth } = getCurrentDateInfo()

  const CURRENT_DATE = {
    month: currentMonth,
    year: currentYear,
  }

  const [selectedDate, setSelectedDate] =
    useState<SelectedDateType>(CURRENT_DATE)
  const [type, setType] = useState<"incomeExpense" | "net">("incomeExpense")

  const IncomeExpenseData = useMemo(() => {
    return buildMultiColumnData({
      firstData: transactions,
      secondData: transactions,
      selectedYear: selectedDate.year,
      firstColumnTitle: "Month",
      method: "compare",
    })
  }, [transactions, selectedDate.year])

  const eachMonthNetIncome: [string, number][] = useMemo(() => {
    return MONTHS.map((month) => {
      const { incomeTotalMonthNet, expenseTotalMonthNet } =
        getTotalsForMonthNetCash(selectedDate.year, month, transactions)
      const net = getNetCashFlow(incomeTotalMonthNet, expenseTotalMonthNet)
      return [month, net]
    })
  }, [selectedDate.year, transactions])

  const NetChartData: TwoColumnDataType = useMemo(() => {
    return buildTwoColumnData({
      data: eachMonthNetIncome,
      firstColumnTitle: "Month",
      secondColumnTitle: "Net Cash Flow",
    })
  }, [eachMonthNetIncome])

  const resetSelectedDate = () => {
    setSelectedDate(CURRENT_DATE)
  }

  const handleSelectType = (
    event: React.MouseEvent<HTMLElement>,
    newType: "incomeExpense" | "net" | null,
  ) => {
    if (newType !== null) {
      setType(newType)
    }
  }

  return (
    <Stack gap={1}>
      <MonthYearSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        resetSelectedDate={resetSelectedDate}
        showMonth={false}
      />

      <ShowCaseCard title="">
        <Stack spacing={3}>
          <ToggleButtonGroup
            value={type}
            exclusive
            size={"small"}
            onChange={handleSelectType}
            sx={{
              width: "100%",
              justifyContent: "center",
              gap: 3,
              "& .MuiToggleButton-root": {
                borderRadius: "15px",
                border: "1px solid",
                px: 3,
                textTransform: "none",
              },
              "& .MuiToggleButtonGroup-grouped": {
                margin: 0,
                border: "1px solid",
                "&:not(:first-of-type)": {
                  borderLeft: "1px solid",
                },
              },
            }}
          >
            <ToggleButton value="incomeExpense">Income / Expense</ToggleButton>

            <ToggleButton value="net">Net Cash Flow</ToggleButton>
          </ToggleButtonGroup>

          <Box sx={{ minHeight: 400 }}>
            <BarChart
              multiColumnData={
                type === "incomeExpense" ? IncomeExpenseData : undefined
              }
              twoColumnData={type === "net" ? NetChartData : undefined}
              barColors={
                type === "incomeExpense"
                  ? [positiveColor.color, negativeColor.color]
                  : [neutralColor.color]
              }
            />
          </Box>
        </Stack>
      </ShowCaseCard>
    </Stack>
  )
}

export default Insights
