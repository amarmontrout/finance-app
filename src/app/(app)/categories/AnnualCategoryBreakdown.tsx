import PieChart from "@/components/PieChart"
import ShowCaseCard from "@/components/ShowCaseCard"
import { FlexColWrapper } from "@/components/Wrappers"

const AnnualCategoryBreakdown = ({
  selectedYear,
  annualIncomeCategoryTotals,
  annualExpenseCategoryTotals,
}: {
  selectedYear: string
  annualIncomeCategoryTotals: [string, string | number][]
  annualExpenseCategoryTotals: [string, string | number][]
}) => {
  return (
    <FlexColWrapper gap={2} toRowBreak={"xl"}>
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
    </FlexColWrapper>  
  )
}

export default AnnualCategoryBreakdown