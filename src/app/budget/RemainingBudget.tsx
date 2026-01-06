import ColoredInfoCard from "@/components/ColoredInfoCard"
import ShowCaseCard from "@/components/ShowCaseCard"
import { FlexColWrapper } from "@/components/Wrappers"
import { BudgetCategoryType } from "@/contexts/budget-context"
import { getCardColor } from "@/utils/helperFunctions"

const RemainingBudget = ({ 
  budgetCategories,
  currentTheme
 }: { 
  budgetCategories: BudgetCategoryType[]
  currentTheme: string | undefined
}) => {
  const defaultCardColor = getCardColor(currentTheme, "default")

  return (
    <ShowCaseCard title={"Remaining Budget for the Week"}>
      <FlexColWrapper gap={2} toRowBreak={"xl"}>
        {budgetCategories.map((entry) => {
            return (
              <ColoredInfoCard
                key={entry.category}
                cardColors={defaultCardColor}
                title={entry.category}
                info={`$${entry.amount}`}
              />
            ) 
          })}
      </FlexColWrapper>
    </ShowCaseCard>
  )
}

export default RemainingBudget