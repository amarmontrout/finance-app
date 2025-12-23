import { Box, Typography } from "@mui/material"

const ColoredInfoCard = (props: {
  resultColors: {
    background: string,
    textIcon: string,
    border: string
  }
  selectedMonth: string
  selectedYear: string
  data: string
}) => {
  const {
    resultColors,
    selectedMonth,
    selectedYear,
    data
  }= props

  return (
    <Box
      className="flex flex-col gap-2 h-full"
      border={`2px solid ${resultColors.border}`} 
      borderRadius={"10px"} 
      padding={"15px"} 
      margin={"0 auto"} 
      width={"100%"}
      alignItems={"center"}
      sx={{
        backgroundColor: resultColors.background
      }}
    >
      <Typography 
        color={resultColors.textIcon}
        sx={{
          fontSize: {
            xs: ".75rem",
            md: "1rem"
          }
        }}
      >
        {`Net Cash Flow for ${selectedMonth} ${selectedYear}`}
      </Typography>
      <hr style={{ width: "100%", borderColor: resultColors.border}}/>
      <Typography 
        color={resultColors.textIcon}
        sx={{
          fontSize: {
            xs: "2rem",
            md: "3rem"
          }
        }}
      >
        {data}
      </Typography>
    </Box>    
  )
}

export default ColoredInfoCard