import ShowCaseCard from "@/components/ShowCaseCard"
import { Box } from "@mui/material"

const Page = () => {
  return (
    <Box
      width={"100%"}
    >
      <Box
        className="flex flex-col gap-2 h-full"
      >
        <ShowCaseCard title={"Trends"}>
          In progress...
        </ShowCaseCard>
      </Box>
    </Box>
  )
}

export default Page