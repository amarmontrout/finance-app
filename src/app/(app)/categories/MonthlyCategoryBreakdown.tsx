import PieChart from "@/components/PieChart"
import ShowCaseCard from "@/components/ShowCaseCard"
import { FlexColWrapper } from "@/components/Wrappers"

const MonthlyCategoryBreakdown = ({
  selectedMonth,
  selectedYear,
  monthIncomeCategoryTotals,
  monthExpenseCategoryTotals,
}: {
  selectedMonth: string
  selectedYear: number
  monthIncomeCategoryTotals: any[]
  monthExpenseCategoryTotals: any[]
}) => {
  return (
    <FlexColWrapper gap={2}>
      <FlexColWrapper gap={2} toRowBreak={"xl"}>
        <ShowCaseCard
          title={`${selectedMonth} ${selectedYear} Income Category Breakdown`}
        >
          <PieChart data={monthIncomeCategoryTotals} />
        </ShowCaseCard>

        <ShowCaseCard
          title={`${selectedMonth} ${selectedYear} Expense Category Breakdown`}
        >
          <PieChart data={monthExpenseCategoryTotals} />
        </ShowCaseCard>
      </FlexColWrapper>
    </FlexColWrapper>
  )
}

export default MonthlyCategoryBreakdown
