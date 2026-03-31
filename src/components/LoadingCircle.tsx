import { Box, CircularProgress, Typography } from "@mui/material"

const LoadingCircle = ({ height }: { height: number }) => {
  return (
    <Box height={`${height}px`} textAlign={"center"} alignContent={"center"}>
      <CircularProgress />
      <Typography>Loading</Typography>
    </Box>
  )
}

export default LoadingCircle
