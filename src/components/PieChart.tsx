import { lightMode, darkMode } from "@/globals/colors";
import { Box } from "@mui/material"
import { useTheme } from "next-themes";
import Chart from "react-google-charts"

const PieChart = ({
  data
}: {
  data: [string, string | number][]
}) => {
  const { theme: currentTheme } = useTheme()
  
  const backgroundColor = currentTheme === "light" ?
    lightMode.elevatedBg 
    : darkMode.elevatedBg
  const textColor = currentTheme === "light"? "#000" : "#FFF"
  
  const options = {
    is3D: true,
    backgroundColor: backgroundColor,
    titleTextStyle: { color: textColor },
    legend: {
      textStyle: { color: textColor },
      position: "right"
    },
    chartArea: {
      top: 50,
      left: 50,
      width: "100%",
      height: "100%"
    }
  }

  return (
    <Box
      // This box makes the rounded corners for the chart
      overflow={"hidden"}
      borderRadius={"15px"}
    >
      <Chart
        chartType={"PieChart"}
        height={"400px"}
        width={"100%"}
        data={data}
        options={options}
        />
    </Box>
  )
}

export default PieChart