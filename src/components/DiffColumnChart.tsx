import { darkMode, lightMode } from "@/globals/colors"
import { Box } from "@mui/material"
import { useTheme } from "next-themes"
import Chart from "react-google-charts"

const DiffColumnChart = () => {

  const { theme: currentTheme } = useTheme()
  const backgroundColor = currentTheme === "light" ?
    lightMode.elevatedBg 
    : darkMode.elevatedBg
  const textColor = currentTheme === "light"? "#000" : "#FFF"

  const options = {
    backgroundColor: backgroundColor,
    titleTextStyle: { color: textColor },
    legend: {
      textStyle: { color: textColor },
      position: "right"
    },
    hAxis: {
      textStyle: { color: textColor },
      titleTextStyle: { color: textColor },
      slantedText: true
    },
    vAxis: {
      baseline: 0,
      textStyle: { color: textColor },
      titleTextStyle: { color: textColor },
      gridlines: {
        count: 10,
        color: textColor
      },
      minorGridlines: {
        count: 0
      }
    },
  }

  const dataOld = [
    ["Name", "Popularity"],
    ["Cesar", 250],
    ["Rachel", 4200],
    ["Patrick", 2900],
    ["Eric", 8200],
  ]

  const dataNew = [
    ["Name", "Popularity"],
    ["Cesar", 370],
    ["Rachel", 600],
    ["Patrick", 700],
    ["Eric", 1500],
  ]

  const diffdata = {
    old: dataOld,
    new: dataNew,
  }

  return (
    <Box
      // This box makes the rounded corners for the chart
      overflow={"hidden"}
      borderRadius={"10px"}
    >
      <Chart
        chartType={"ColumnChart"}
        width={"100%"}
        height={"400px"}
        diffdata={diffdata}
        options={options}
      />
    </Box>
  )
}

export default DiffColumnChart