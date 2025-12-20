import { darkMode, lightMode } from "@/globals/colors"
import { MultiColumnDataType, TwoColumnDataType } from "@/utils/buildChartData"
import { Box } from "@mui/material"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Chart } from "react-google-charts"

const LineChart = (props: {
  twoColumnData?: TwoColumnDataType
  multiColumnData?: MultiColumnDataType
  title: string
  lineColors: string[]
  height?: string
}) => {
  const {
    twoColumnData,
    multiColumnData,
    title,
    lineColors,
    height
  } = props
  const [chartData, setChartData] = useState<TwoColumnDataType | MultiColumnDataType>([])

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
      baseline: 0,
      baselineColor: "red",
      textStyle: { color: textColor },
      titleTextStyle: { color: textColor },
      format: "currency",
      gridlines: {
        count: 12,
        color: textColor
      },
      minorGridlines: {
        count: 0
      }
    },
    legend: {
      textStyle: { color: textColor },
      position: "right"
    },
  }

  useEffect(() => {
    if (twoColumnData) setChartData(twoColumnData)
    if (multiColumnData) setChartData(multiColumnData)
  }, [twoColumnData, multiColumnData])

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