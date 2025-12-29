import ColoredInfoCard from "@/components/ColoredInfoCard"
import ShowCaseCard from "@/components/ShowCaseCard"
import { FlexChildWrapper } from "@/components/Wrappers"
import { useCategoryContext } from "@/contexts/categories-context"
import { useTransactionContext } from "@/contexts/transactions-context"
import { healthStateDarkMode, healthStateLightMode } from "@/globals/colors"
import { Box } from "@mui/material"
import { useTheme } from "next-themes"

const Projections = () => {

  const { expenseTransactions } = useTransactionContext()
  const { expenseCategories } = useCategoryContext()
  const { theme: currentTheme } = useTheme()
  const defaultColor = (currentTheme === "light"
    ? healthStateLightMode
    : healthStateDarkMode)["default"]

  return (
    <ShowCaseCard title={"Projections for the Year"}>
      <Box
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
      >
        {
          expenseCategories.map((category) => 
            <FlexChildWrapper key={category.name}>
              <ColoredInfoCard
                cardColors={defaultColor}
                title={category.name}
                info={"$50"}
              />
            </FlexChildWrapper>
          )
        }
      </Box>
    </ShowCaseCard>
  )
}

export default Projections