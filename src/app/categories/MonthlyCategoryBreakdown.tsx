import ColoredInfoCard from "@/components/ColoredInfoCard"
import PieChart from "@/components/PieChart"
import ShowCaseCard from "@/components/ShowCaseCard"
import { formattedStringNumber } from "@/utils/helperFunctions"
import { Box } from "@mui/material"

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
    <Box
      className="flex flex-col gap-2 h-full"
    >
      <ShowCaseCard title={`Top 3 Expenses for ${selectedMonth} ${selectedYear}`}>
        <Box
          className="flex flex-col lg:flex-row gap-2 h-full"
        >
          {topThreeExpenses.map(([category, amount], idx) => (
            <ColoredInfoCard
              key={category}
              cardColors={defaultCardColor}
              info={`$${formattedStringNumber(Number(amount))}`}
              title={`${idx+1}) ${category}`}
            />
          ))}
        </Box>
      </ShowCaseCard>
      <Box
        className="flex flex-col xl:flex-row gap-2 h-full"
      >
        <ShowCaseCard title={`${selectedMonth} ${selectedYear} Income Category Breakdown`}>
          <PieChart
            data={monthIncomeCategoryTotals}
          />
        </ShowCaseCard>
        <ShowCaseCard title={`${selectedMonth} ${selectedYear} Expense Category Breakdown`}>
          <PieChart
            data={monthExpenseCategoryTotals}
          />
        </ShowCaseCard>
      </Box>
    </Box>    
  )
}

export default MonthlyCategoryBreakdown