import ColoredInfoCard from "@/components/ColoredInfoCard"
import ShowCaseCard from "@/components/ShowCaseCard"
import { FlexColWrapper } from "@/components/Wrappers"
import { formattedStringNumber, getCardColor } from "@/utils/helperFunctions"
import { BudgetTypeV2 } from "@/utils/type"

const RemainingBudget = ({
  budgetCategories,
  currentTheme,
}: {
  budgetCategories: BudgetTypeV2[]
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
          const cardColor =
            remaining < 0 ? negativeCardColor : positiveCardColor

          return (
            <ColoredInfoCard
              key={category}
              cardColors={cardColor}
              title={category}
              info={`$${formattedStringNumber(remaining)}`}
            />
          )
        })}
      </FlexColWrapper>
    </ShowCaseCard>
  )
}

export default RemainingBudget
