import { accentColorSecondary, darkMode, lightMode } from "@/globals/colors"
import { TransactionData } from "@/utils/saveTransaction"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Chart } from "react-google-charts"

type ChartData = [string, string | number][]

const LineChart = (props: {
  selectedYear: string
  transactions: TransactionData
  type: "Income" | "Expenses"
}) => {
  const {
    selectedYear,
    transactions,
    type
  } = props

  const [data, setData] = useState<ChartData>([])
    const theme = useTheme()
    const currentTheme = theme.theme

    const backgroundColor = currentTheme === "light"? lightMode.elevatedBg : darkMode.elevatedBg
    const textColor = currentTheme === "light"? "#000" : "#FFF"

  const options = {
    backgroundColor: backgroundColor,
    title: `${type} for year ${selectedYear}`,
    titleTextStyle: { color: textColor },
    colors: [accentColorSecondary],
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
    if (!selectedYear || !transactions) return

    const newData: ChartData = [["Month", "Income"]]

    Object.entries(transactions[selectedYear]).forEach(
      ([month, transactions]) => {
        const total = transactions.reduce(
          (sum, t) => sum + Number(t.amount),
          0
        )

        newData.push([month, Number(total.toFixed(2))])
      }
    )

    setData(newData)
  }, [selectedYear, transactions])

  return (
    <Chart
      chartType="LineChart"
      width={"100%"}
      height={"100%"}
      data={data}
      options={options}
    />
  )
}

export default LineChart