import { Box } from "@mui/material"
import AverageExpenses from "./AverageExpenses"

const Trends =() => {
  return (
    <Box
      className="flex flex-col gap-2 h-full"
    >
      <AverageExpenses/>
    </Box>
  )
}

export default Trends