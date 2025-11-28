import ShowCaseCard from "@/components/ShowCaseCard"
import { Box } from "@mui/material"

const Expenses = () => {
  return (
    <Box
      display={"flex"}
      flex={1}
      justifyContent={"center"}
      alignItems={"center"}
      padding={"50px"}
    >
      <ShowCaseCard title={"Expenses"}>
        Content
      </ShowCaseCard>
    </Box>
  )
}

export default Expenses