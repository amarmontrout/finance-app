"use client"

import ColoredInfoCard from "@/components/ColoredInfoCard"
import ShowCaseCard from "@/components/ShowCaseCard"
import { FlexChildWrapper, FlexColWrapper } from "@/components/Wrappers"
import { darkMode, lightMode } from "@/globals/colors"
import { MONTHS } from "@/globals/globals"
import { getAnnualProjection } from "@/utils/financialFunctions"
import { formattedStringNumber, getCardColor } from "@/utils/helperFunctions"
import { ChoiceTypeV2, TransactionTypeV2 } from "@/utils/type"
import { 
  Box, 
  Divider, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select 
} from "@mui/material"
import { useMemo, useState } from "react"

const Projections = ({
  expenseTransactions,
  currentTheme,
  expenseCategories,
  excludedSet,
  currentYear,
  currentMonth
}: {
  expenseTransactions: TransactionTypeV2[]
  currentTheme: string | undefined
  expenseCategories: ChoiceTypeV2[]
  excludedSet: Set<string>
  currentYear: string
  currentMonth: string
}) => {
  const [view, setView] = useState<"annual" | "month">("annual")

  const defaultColor = getCardColor(currentTheme, "default")

  const annualProjectionPerCategory = useMemo(() => {
    const passedMonths = MONTHS.indexOf(currentMonth) + 1
    const projectionMap = new Map<string, number>()
    const relevantTransactions = expenseTransactions.filter((t) => {
      return (
        t.year === Number(currentYear) &&
        MONTHS.indexOf(t.month) + 1 <= passedMonths
      )
    })

    for (const category of expenseCategories) {
      let total = 0
      for (const t of relevantTransactions) {
        if (t.category !== category.name) continue
        if (t.year !== Number(currentYear)) continue
        total += t.amount
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

  const totalProj = useMemo(() => {
    let total = 0

    annualProjectionPerCategory.forEach((value, key) => {
      if (!excludedSet.has(key)) {
        total += value
      }
    })
    if (view === "annual") {
      return total
    } else {
      return total/12
    }
  }, [annualProjectionPerCategory, view])

  return (
    <ShowCaseCard 
      title={`${currentYear} Projections`}
      secondaryTitle={`Total: $${formattedStringNumber(totalProj)}`}
    >
      <FlexColWrapper gap={2}>
        <FormControl>
          <InputLabel>View</InputLabel>
          <Select
            className="w-full sm:w-[200px]"
            label="View"
            value={view}
            name={"view"}
            onChange={e => setView(e.target.value)}
          >
            <MenuItem key={"annual"} value={"annual"}>
              Annual Projection
            </MenuItem>
            <MenuItem key={"month"} value={"month"}>
              Monthly Projection
            </MenuItem>
          </Select>
        </FormControl>

        <Divider 
          className="flex w-full"
          sx={{ 
            borderColor: currentTheme === "light" ?
              lightMode.borderStrong 
              : darkMode.borderStrong,
            borderWidth: 1
          }}
        />

        <Box
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
        >
          {
            expenseCategories.map((category) => {
              const proj = annualProjectionPerCategory.get(category.name) ?? 0
              if (proj === 0) return

              const annual = formattedStringNumber(proj)
              const monthly = formattedStringNumber(proj/12)

              return (
                <FlexChildWrapper key={category.name}>
                  <ColoredInfoCard
                    cardColors={defaultColor}
                    title={category.name}
                    info={`$${view === "annual" ? annual : monthly}`}
                  />
                </FlexChildWrapper>
              )
            })
          }
        </Box>
      </FlexColWrapper>
    </ShowCaseCard>
  )
}

export default Projections