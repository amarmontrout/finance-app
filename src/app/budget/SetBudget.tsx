import ColoredInfoCard from "@/components/ColoredInfoCard"
import ShowCaseCard from "@/components/ShowCaseCard"
import { FlexColWrapper } from "@/components/Wrappers"
import { BudgetCategoryType } from "@/contexts/budget-context"
import { healthStateDarkMode, healthStateLightMode } from "@/globals/colors"
import { useTheme } from "next-themes"

const SetBudget = ({ 
  budgetCategories
 }: { 
  budgetCategories: BudgetCategoryType[] 
}) => {
  const { theme: currentTheme } = useTheme()
  const defaultCardColor = (currentTheme === "light" 
    ? healthStateLightMode
    : healthStateDarkMode)["default"]

  return (
    <ShowCaseCard title={"Weekly Budget"}>
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

export default SetBudget