import DiffColumnChart from "@/components/DiffColumnChart"
import ShowCaseCard from "@/components/ShowCaseCard"
import { Box } from "@mui/material"

const ExpectedSpending = () => {
  return (
    <ShowCaseCard 
      title={`Expected VS. Actual Spending`}
    >
      <Box>
        <DiffColumnChart/>
      </Box>
      </ShowCaseCard>
  )
}

export default ExpectedSpending