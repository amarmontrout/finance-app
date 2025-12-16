import { lightMode, darkMode } from "@/globals/colors";
import { Box } from "@mui/material"
import { useTheme } from "next-themes";
import Chart from "react-google-charts"

const PieChart = () => {
  const theme = useTheme()
  const currentTheme = theme.theme
  const backgroundColor = currentTheme === "light"? lightMode.elevatedBg : darkMode.elevatedBg
  const textColor = currentTheme === "light"? "#000" : "#FFF"

  const dataOld = [
    ["Major", "Degrees"],
    ["Business", 256070],
    ["Education", 108034],
    ["Social Sciences &amp; History", 127101],
    ["Health", 81863],
    ["Psychology", 74194],
  ];
  
  const dataNew = [
    ["Major", "Degrees"],
    ["Business", 358293],
    ["Education", 101265],
    ["Social Sciences &amp; History", 172780],
    ["Health", 129634],
    ["Psychology", 97216],
  ];
  
  const diffdata = {
    old: dataOld,
    new: dataNew,
  };
  
  const options = {
    backgroundColor: backgroundColor,
    title: "Categories",
    titleTextStyle: { color: textColor },
    legend: {
      textStyle: { color: textColor },
    },
  }
  
  return (
    <Box
      // This box makes the rounded corners for the chart
      marginTop={"10px"}
      overflow={"hidden"}
      borderRadius={"10px"}
    >
      <Chart
        chartType={"PieChart"}
        height={"400px"}
        width={"100%"}
        diffdata={diffdata}
        options={options}
        />
    </Box>
  )
}

export default PieChart