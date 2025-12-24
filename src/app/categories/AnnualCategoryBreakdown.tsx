import PieChart from "@/components/PieChart"
import ShowCaseCard from "@/components/ShowCaseCard"
import { Box } from "@mui/material"

type Props = {
  selectedYear: string
  annualIncomeCategoryTotals: any[]
  annualExpenseCategoryTotals: any[]
}

const AnnualCategoryBreakdown = ({
  selectedYear,
  annualIncomeCategoryTotals,
  annualExpenseCategoryTotals,
}: Props) => {
  return (
    <Box
      className="flex flex-col xl:flex-row gap-2 h-full"
    >
      <ShowCaseCard title={`${selectedYear} Income Category Breakdown`}>
        <PieChart
          data={annualIncomeCategoryTotals}
        />
      </ShowCaseCard>
      <ShowCaseCard title={`${selectedYear} Expense Category Breakdown`}>
        <PieChart
          data={annualExpenseCategoryTotals}
        />
      </ShowCaseCard>
    </Box>    
  )
}

export default AnnualCategoryBreakdown