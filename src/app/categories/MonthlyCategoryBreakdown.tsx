import ColoredInfoCard from "@/components/ColoredInfoCard"
import PieChart from "@/components/PieChart"
import ShowCaseCard from "@/components/ShowCaseCard"
import { FlexColWrapper } from "@/components/Wrappers"
import { formattedStringNumber } from "@/utils/helperFunctions"

type Props = {
  selectedMonth: string
  selectedYear: string
  monthIncomeCategoryTotals: any[]
  monthExpenseCategoryTotals: any[]
  topThreeExpenses: [string, string | number][]
  defaultCardColor: any
}

const MonthlyCategoryBreakdown = ({
  selectedMonth,
  selectedYear,
  monthIncomeCategoryTotals,
  monthExpenseCategoryTotals,
  topThreeExpenses,
  defaultCardColor,
}: Props) => {
  return (
    <FlexColWrapper gap={2}>
      <ShowCaseCard title={`Top Expenses for ${selectedMonth} ${selectedYear}`}>
        <FlexColWrapper gap={2} toRowBreak={"lg"}>
          {topThreeExpenses.map(([category, amount], idx) => (
            <ColoredInfoCard
              key={category}
              cardColors={defaultCardColor}
              info={`$${formattedStringNumber(Number(amount))}`}
              title={`${idx+1}) ${category}`}
            />
          ))}
        </FlexColWrapper>
      </ShowCaseCard>

      <FlexColWrapper gap={2} toRowBreak={"xl"}>
        <ShowCaseCard 
          title={`${selectedMonth} ${selectedYear} Income Category Breakdown`}
        >
          <PieChart
            data={monthIncomeCategoryTotals}
          />
        </ShowCaseCard>

        <ShowCaseCard 
          title={`${selectedMonth} ${selectedYear} Expense Category Breakdown`}
        >
          <PieChart
            data={monthExpenseCategoryTotals}
          />
        </ShowCaseCard>
      </FlexColWrapper>
    </FlexColWrapper>
  )
}

export default MonthlyCategoryBreakdown