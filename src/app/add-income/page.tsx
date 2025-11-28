import ShowCaseCard from "@/components/ShowCaseCard"
import { Box } from "@mui/material"
import AddIncome from "./AddIncome"

const Page = () => {
  return (
    <Box
      display={"flex"}
      flex={1}
      justifyContent={"center"}
      alignItems={"center"}
      padding={"50px"}
    >
      <ShowCaseCard title={"Add Income"}>
        <AddIncome/>
      </ShowCaseCard>
    </Box>
  )
}

export default Page