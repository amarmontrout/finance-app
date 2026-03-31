import { Box, CircularProgress, Typography } from "@mui/material"

const LoadingCircle = ({ height }: { height: number }) => {
  return (
    <Box height={height} textAlign={"center"} alignContent={"center"}>
      <CircularProgress size={"4rem"} />
      <Typography>Loading</Typography>
    </Box>
  )
}

export default LoadingCircle
