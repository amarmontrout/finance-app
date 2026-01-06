"use client"

import ColoredInfoCard from "@/components/ColoredInfoCard"
import ShowCaseCard from "@/components/ShowCaseCard"
import { FlexChildWrapper } from "@/components/Wrappers"
import { Choice } from "@/contexts/categories-context"
import { MONTHS } from "@/globals/globals"
import { getAnnualProjection } from "@/utils/financialFunctions"
import { 
  cleanNumber, 
  flattenTransactions, 
  formattedStringNumber,
  getCardColor
} from "@/utils/helperFunctions"
import { TransactionData } from "@/utils/transactionStorage"
import { Box } from "@mui/material"
import { useEffect, useMemo } from "react"

const Projections = ({
  expenseTransactions,
  refreshExpenseTransactions,
  currentTheme,
  expenseCategories,
  excludedSet,
  currentYear,
  currentMonth
}: {
  expenseTransactions: TransactionData
  refreshExpenseTransactions: () => void
  currentTheme: string | undefined
  expenseCategories: Choice[]
  excludedSet: Set<string>
  currentYear: string
  currentMonth: string
}) => {
  useEffect(() => {
    refreshExpenseTransactions()
  }, [])  

  const defaultColor = getCardColor(currentTheme, "default")

  const annualProjectionPerCategory = useMemo(() => {
    const flattenedData = flattenTransactions(expenseTransactions)
    const passedMonths = MONTHS.indexOf(currentMonth) + 1
    const projectionMap = new Map<string, number>()
    const relevantTransactions = flattenedData.filter((t) => {
      return (
        t.year === currentYear &&
        MONTHS.indexOf(t.month) + 1 <= passedMonths
      )
    })

    for (const category of expenseCategories) {
      let total = 0
      for (const t of relevantTransactions) {
        if (t.category !== category.name) continue
        if (t.year !== currentYear) continue
        total += cleanNumber(t.amount)
      }
      const projectedValue = category.isRecurring
        ? getAnnualProjection(total, passedMonths)
        : total
      projectionMap.set(
        category.name,
        projectedValue
      )
    }

    return projectionMap
  }, [expenseCategories, expenseTransactions, currentYear, currentMonth])

  const annualTotalExpenseProjection = useMemo(() => {
    let total = 0

    annualProjectionPerCategory.forEach((value, key) => {
      if (!excludedSet.has(key)) {
        total += value
      }
    })

    return total
  }, [annualProjectionPerCategory])

  return (
    <ShowCaseCard 
      title={`${currentYear} Projections`}
      secondaryTitle={`Total: $${formattedStringNumber(annualTotalExpenseProjection)}`}
    >
      <Box
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
      >
        {
          expenseCategories.map((category) => {
            const proj = annualProjectionPerCategory.get(category.name) ?? 0
            return (
              <FlexChildWrapper key={category.name}>
                <ColoredInfoCard
                  cardColors={defaultColor}
                  title={category.name}
                  info={`$${formattedStringNumber(proj)}`}
                />
              </FlexChildWrapper>
            )
          })
        }
      </Box>
    </ShowCaseCard>
  )
}

export default Projections