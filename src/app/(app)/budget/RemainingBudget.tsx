import ColoredInfoCard from "@/components/ColoredInfoCard"
import ShowCaseCard from "@/components/ShowCaseCard"
import { FlexColWrapper } from "@/components/Wrappers"
import { BudgetCategoryType } from "@/contexts/budget-context"
import { cleanNumber, getCardColor } from "@/utils/helperFunctions"

const RemainingBudget = ({ 
  budgetCategories,
  currentTheme
 }: { 
  budgetCategories: BudgetCategoryType[]
  currentTheme: string | undefined
}) => {
  const positiveCardColor = getCardColor(currentTheme, "great")
  const negativeCardColor = getCardColor(currentTheme, "concerning")

  return (
    <ShowCaseCard title={"Remaining Budget for the Week"}>
      <FlexColWrapper gap={2} toRowBreak={"xl"}>
        {budgetCategories.map((entry) => {
          const category = entry.category
          const remaining = entry.amount
          const cardColor = cleanNumber(remaining) < 0 ? 
            negativeCardColor 
            : positiveCardColor

          return (
            <ColoredInfoCard
              key={category}
              cardColors={cardColor}
              title={category}
              info={`$${remaining}`}
            />
          ) 
        })}
      </FlexColWrapper>
    </ShowCaseCard>
  )
}

export default RemainingBudget