import { Box, Typography } from "@mui/material"

const ColoredInfoCard = (props: {
  cardColors: {
    background: string,
    textIcon: string,
    border: string
  }
  info: string
  title: string
}) => {
  const {
    cardColors,
    info,
    title
  }= props

  return (
    <Box
      className="flex flex-col"
      border={`2px solid ${cardColors.border}`} 
      borderRadius={"10px"} 
      padding={"15px"}
      minWidth={"fit-content"}
      width={"100%"}
      sx={{
        backgroundColor: cardColors.background
      }}
    >
      <Typography 
        color={cardColors.textIcon}
        sx={{
          fontSize: {
            xs: "1rem",
            md: "1.25rem"
          }
        }}
      >
        {title}
      </Typography>

      <Typography 
        color={cardColors.textIcon}
        sx={{
          fontSize: {
            xs: "2rem",
            md: "2.25rem"
          },
          textAlign: "right"
        }}
      >
        {info}
      </Typography>
    </Box>    
  )
}

export default ColoredInfoCard