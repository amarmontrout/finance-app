import { darkMode, lightMode } from "@/globals/colors"
import { MONTHS } from "@/globals/globals"
import { TransactionData } from "@/utils/saveTransaction"
import { Box } from "@mui/material"
import { useTheme } from "next-themes"
import { useMemo } from "react"
import { Chart } from "react-google-charts"

type ChartRow = (string | number)[]
type TwoColumnData = ChartRow[]
type ThreeColumnData = [string, string | number, string | number][]

const LineChart = (props: {
  selectedYear: string
  transactions?: TransactionData
  comparisonTransactions?: TransactionData
  netCashFlowData?: [string, string][]
  title: string
  lineColors: string[]
  height?: string
}) => {
  const {
    selectedYear,
    transactions,
    netCashFlowData,
    comparisonTransactions,
    title,
    lineColors,
    height
  } = props

  const theme = useTheme()
  const currentTheme = theme.theme
  const backgroundColor = currentTheme === "light"? lightMode.elevatedBg : darkMode.elevatedBg
  const textColor = currentTheme === "light"? "#000" : "#FFF"

  const options = {
    backgroundColor: backgroundColor,
    title: title,
    titleTextStyle: { color: textColor },
    colors: lineColors,
    lineWidth: 3,
    pointsVisible: true,
    chartArea: {
      width: "75%"
    },
    hAxis: {
      textStyle: { color: textColor },
      titleTextStyle: { color: textColor },
      slantedText: true
    },
    vAxis: {
      textStyle: { color: textColor },
      titleTextStyle: { color: textColor },
      format: "currency",
      gridlines: {
        count: 10
      },
      minorGridlines: {
        count: 0
      }
    },
    legend: {
      textStyle: { color: textColor },
      position: "top"
    },
  }

  const buildIncomeExpenseData = (): TwoColumnData => {
    if (!transactions) return []
    const years = Object.keys(transactions).sort()
    const chartData: TwoColumnData = [["Month", ...years]]

    for (const month of MONTHS) {
      const row: (string | number)[] = [month]
      for (const year of years) {
        const total = transactions[year]?.[month]?.filter(t => t.category !== "Water")
        .reduce( (sum, t) => sum + Number(t.amount), 0 ) || 0

        row.push(Number(total.toFixed(2)))
      }
      chartData.push(row)
    }
    return chartData
  }

  const buildNetCashFlowData = (): TwoColumnData => {
    if (!netCashFlowData) return []
    const chartData: TwoColumnData = [["Month", "Net Cash Flow"]]

    netCashFlowData.forEach((row) => {
      chartData.push([row[0], Number(row[1])])
    })

    return chartData
  }

  const buildComparisonData = (): ThreeColumnData => {
    if (!transactions || !comparisonTransactions) return []

    const comparisonData: ThreeColumnData = [["Month", "Income", "Expenses"]]
    const income: Record<string, number> = {}
    const expense: Record<string, number> = {}

    // Compute income totals, defaulting to 0 if missing
    Object.entries(transactions[selectedYear]).forEach(([month, _]) => {
      const monthIncome = transactions[selectedYear]?.[month]?.reduce(
        (sum, t) => sum + Number(t.amount), 0
      ) ?? 0

      income[month] = monthIncome
    })

    // Compute expense totals
    Object.entries(comparisonTransactions[selectedYear]).forEach(([month, transactions]) => {
      const monthExpense = transactions
        .filter(t => t.category !== "Water")
        .reduce((sum, t) => sum + Number(t.amount), 0)

      expense[month] = monthExpense
    })

    MONTHS.forEach((month) => {
      comparisonData.push([
        month,
        Number((income[month] ?? 0).toFixed(2)),
        Number((expense[month] ?? 0).toFixed(2))
      ])
    })

    return comparisonData
  }

  const chartData = useMemo(() => {
    if (comparisonTransactions?.[selectedYear]) {
      return buildComparisonData()
    }

    if (netCashFlowData) {
      return buildNetCashFlowData()
    }

    return buildIncomeExpenseData()
  }, [selectedYear, transactions, comparisonTransactions, netCashFlowData])


  return (
    <Box
      // This box makes the rounded corners for the chart
      marginTop={"10px"}
      overflow={"hidden"}
      borderRadius={"10px"}
    >
      <Chart
        chartType={"LineChart"}
        width={"100%"}
        height={height ? height : "100%"}
        data={chartData}
        options={options}
      />
    </Box>
  )
}

export default LineChart