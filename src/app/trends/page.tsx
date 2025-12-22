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

        {/* <ShowCaseCard title={"Category Averages"}>
          Show trend in each expense category each month for the selected year.
          Also should display the monthly average of each category for the year and compare to previous year.
        </ShowCaseCard>

        <ShowCaseCard title={"Income Averages"}>
          "Are we bringing in more or less than last year?"
        </ShowCaseCard>

        <ShowCaseCard title={"Expense Averages"}>
          "Is our total spending increasing?"
        </ShowCaseCard>

        <ShowCaseCard title={"Forecast"}>
          "This is what next year could look like at this rate"
        </ShowCaseCard> */}
      </Box>
    </Box>
  )
}

export default Page