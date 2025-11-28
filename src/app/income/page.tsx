import ShowCaseCard from "@/components/ShowCaseCard"
import { Box } from "@mui/material"

const Page = () => {
  return (
    <Box
      display={"flex"}
      flex={1}
      justifyContent={"center"}
      alignItems={"center"}
      padding={"50px"}
    >
      <ShowCaseCard title={"Income"}>
        Content
      </ShowCaseCard>
    </Box>
  )
}

export default Page