import { MultiColumnDataType, TwoColumnDataType } from "@/utils/buildChartData"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Chart } from "react-google-charts"

const BarChart = ({
  twoColumnData,
  multiColumnData,
  barColors,
}: {
  twoColumnData?: TwoColumnDataType
  multiColumnData?: MultiColumnDataType
  barColors: string[]
}) => {
  const { theme: currentTheme } = useTheme()

  const [chartData, setChartData] = useState<
    TwoColumnDataType | MultiColumnDataType
  >([])

  const textColor = currentTheme === "light" ? "#000" : "#FFF"

  const options = {
    backgroundColor: "transparent",
    titleTextStyle: { color: textColor },
    colors: barColors,
    chartArea: {
      top: 20,
      left: 45,
      right: 0,
      bottom: 55,
      width: "100%",
      height: "100%",
    },
    hAxis: {
      textStyle: { color: textColor },
      titleTextStyle: { color: textColor },
    },
    vAxis: {
      baseline: 0,
      baselineColor: "red",
      textStyle: { color: textColor },
      titleTextStyle: { color: textColor },
      textPosition: "out",
      format: "$",
      gridlines: {
        count: 10,
        color: textColor,
      },
      minorGridlines: {
        count: 1,
      },
    },
    legend: {
      textStyle: { color: textColor },
      position: "top",
    },
  }

  useEffect(() => {
    if (twoColumnData) setChartData(twoColumnData)
    if (multiColumnData) setChartData(multiColumnData)
  }, [twoColumnData, multiColumnData])

  return (
    <Chart
      chartType={"ColumnChart"}
      width={"100%"}
      height={"400px"}
      data={chartData}
      options={options}
    />
  )
}

export default BarChart
