import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingCircle = ({ height }: { height: number }) => {
  return (
    <Box sx={{ textAlign: "center" }}>
      <CircularProgress size={height} />
      <Typography>Loading</Typography>
    </Box>
  );
};

export default LoadingCircle;
