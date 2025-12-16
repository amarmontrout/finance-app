import { darkMode, lightMode } from "@/globals/colors"
import { TransactionData } from "@/utils/saveTransaction"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Chart } from "react-google-charts"

type IncomeExpenseChartData = [string, string | number][]
type ComparisonChartData = [string, string | number, string | number][]

const LineChart = (props: {
  selectedYear: string
  transactions: TransactionData
  comparisonTransactions?: TransactionData
  type: "Income" | "Expenses" | "Income and Expenses"
  lineColors: string[]
  height?: string
}) => {
  const {
    selectedYear,
    transactions,
    comparisonTransactions,
    type,
    lineColors,
    height
  } = props

  const [incomeExpenseData, setIncomeExpenseData] = useState<IncomeExpenseChartData>([])
  const [comparisonData, setComparisonData] = useState<ComparisonChartData>([])

  const theme = useTheme()
  const currentTheme = theme.theme

  const backgroundColor = currentTheme === "light"? lightMode.elevatedBg : darkMode.elevatedBg
  const textColor = currentTheme === "light"? "#000" : "#FFF"

  const options = {
    backgroundColor: backgroundColor,
    title: `${type} for year ${selectedYear}`,
    titleTextStyle: { color: textColor },
    colors: lineColors,
    lineWidth: 5,
    chartArea: {
      width: "75%"
    },
    hAxis: {
      textStyle: { color: textColor },
      titleTextStyle: { color: textColor },
    },
    vAxis: {
      textStyle: { color: textColor },
      titleTextStyle: { color: textColor },
    },
    legend: {
      textStyle: { color: textColor },
    },
  };


  useEffect(() => {
    if (!selectedYear) return

    if (transactions?.[selectedYear]) {
      const incomeExpenseData: IncomeExpenseChartData = [["Month", "Income"]]

      Object.entries(transactions[selectedYear]).forEach(
        ([month, transactions]) => {
          const total = transactions.reduce(
            (sum, t) => sum + Number(t.amount),
            0
          )

          incomeExpenseData.push([month, Number(total.toFixed(2))])
        }
      )

      setIncomeExpenseData(incomeExpenseData)
    }

    if (transactions?.[selectedYear] && comparisonTransactions?.[selectedYear]) {
      const comparisonData: ComparisonChartData = [["Month", "Income", "Expenses"]]

      const income: Record<string, number> = {}
      const expense: Record<string, number> = {}

      Object.entries(transactions[selectedYear]).forEach(
        ([month, transactions]) => {
          income[month] = transactions.reduce(
            (sum, t) => sum + Number(t.amount),
            0
          )
        }
      )

      Object.entries(comparisonTransactions[selectedYear]).forEach(
        ([month, transactions]) => {
          const total = transactions
            .filter(t => t.category !== "Water")
            .reduce((sum, t) => sum + Number(t.amount), 0);

          expense[month] = total;
        }
      )

      Object.keys(income).forEach((month) => {
        comparisonData.push([
          month,
          Number(income[month].toFixed(2)),
          Number(expense[month].toFixed(2))
        ])
      })

      setComparisonData(comparisonData)
    }
    
  }, [selectedYear, transactions])

  return (
    <Chart
      chartType="LineChart"
      width={"100%"}
      height={height ? height : "100%"}
      data={comparisonTransactions? comparisonData : incomeExpenseData}
      options={options}
    />
  )
}

export default LineChart