import { darkMode, lightMode } from "@/globals/colors"
import { MultiColumnDataType, TwoColumnDataType } from "@/utils/buildChartData"
import { Box } from "@mui/material"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Chart } from "react-google-charts"

const LineChart = ({
  twoColumnData,
  multiColumnData,
  lineColors,
}: {
  twoColumnData?: TwoColumnDataType
  multiColumnData?: MultiColumnDataType
  lineColors: string[]
}) => {
  const { theme: currentTheme } = useTheme()

  const [chartData, setChartData] = useState<
    TwoColumnDataType | MultiColumnDataType
  >([])

  const backgroundColor =
    currentTheme === "light" ? lightMode.elevatedBg : darkMode.elevatedBg
  const textColor = currentTheme === "light" ? "#000" : "#FFF"

  const options = {
    curveType: "function",
    backgroundColor: backgroundColor,
    titleTextStyle: { color: textColor },
    colors: lineColors,
    lineWidth: 3,
    pointsVisible: true,
    chartArea: {
      left: 30,
      right: 10,
      width: "90%",
      height: "65%",
    },
    hAxis: {
      textStyle: { color: textColor },
      titleTextStyle: { color: textColor },
      slantedText: true,
    },
    vAxis: {
      baseline: 0,
      baselineColor: "red",
      textStyle: { color: textColor },
      titleTextStyle: { color: textColor },
      textPosition: "in",
      format: "currency",
      gridlines: {
        count: 10,
        color: textColor,
      },
      minorGridlines: {
        count: 0,
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
    <Box
      // This box makes the rounded corners for the chart
      overflow={"hidden"}
      borderRadius={"15px"}
    >
      <Chart
        chartType={"LineChart"}
        width={"100%"}
        height={"400px"}
        data={chartData}
        options={options}
      />
    </Box>
  )
}

export default LineChart
