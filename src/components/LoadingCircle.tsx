import { Box, CircularProgress, Typography } from "@mui/material"

const LoadingCircle = () => {
  return (
    <Box height={"250px"} textAlign={"center"} alignContent={"center"}>
      <CircularProgress size={"4rem"} />
      <Typography>Loading</Typography>
    </Box>
  )
}

export default LoadingCircle
