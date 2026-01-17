import { MONTHS } from "@/globals/globals"
import { TransactionTypeV2 } from "./type"

export type TwoColumnDataType = [string, string | number][]
export type MultiColumnDataType = (string | number)[][]

/**
 * Builds two column data for Google chart.
 * Must be [string, string] format.
 * The first string as the hAxis.
 * The second string the value that will convert to a number.
 * 
 * @returns Google chart data
 */
export const buildTwoColumnData = (props: {
  data: TwoColumnDataType
  firstColumnTitle: string
  secondColumnTitle: string
}): TwoColumnDataType => {
  const {
    data,
    firstColumnTitle,
    secondColumnTitle
  } = props
  if (!data) return []
  const twoColumndata: TwoColumnDataType = [[firstColumnTitle, secondColumnTitle]]

  data.forEach(([firstColumn, secondColumn]) => {
    twoColumndata.push([firstColumn, Number(secondColumn)])
  })

  return twoColumndata
}

/**
 * Builds multi column data for Google chart.
 * Can pass in income or expenses transactions.
 * Specify "self" for single transaction type over the years.
 * Specify "compare" to compare income and expenses.
 * If "compare", firstData must be income and secondData must be expenses.
 * If "compare", must also pass the selected year or it will error.
 * 
 * @returns Google chart data
 */
export const buildMultiColumnDataV2 = ({
  firstData,
  secondData,
  selectedYear,
  firstColumnTitle,
  method,
  excludedSet
}: {
  firstData: TransactionTypeV2[]
  secondData?: TransactionTypeV2[]
  selectedYear?: number
  firstColumnTitle: string
  method: "self" | "compare"
  excludedSet: Set<string>
}): MultiColumnDataType => {
  if (!firstData) return []
  if (method === "self") {
    const years = Array.from(
      new Set(firstData.map(entry => entry.year))
    ).sort((a, b) => a-b)
    const yearStrings = years.map(String)
    const selfColumnData: MultiColumnDataType = [[
      firstColumnTitle, ...yearStrings
    ]]
    for (const month of MONTHS) {
      const row: (string | number)[] = [month]
      for (const year of years) {
        let total: number = 0
        firstData.forEach((entry) => {
          if (entry.month === month 
            && entry.year === year
            && !excludedSet.has(entry.category)
          ) {
            total += entry.amount
          }
        })
        row.push(Number(total.toFixed(2)))
      }
      selfColumnData.push(row)
    }
    return selfColumnData
  }

  if (!secondData) return []
  if (method === "compare") {
    const compareColumnData: MultiColumnDataType = [[
      firstColumnTitle, "Income", "Expenses"
    ]]
    const income: Record<string, number> = {}
    const expense: Record<string, number> = {}
    MONTHS.forEach((month) => {
      income[month] = 0
      expense[month] = 0
    })
    firstData.forEach((entry) => {
      if (entry.year === selectedYear) {
        income[entry.month] += entry.amount
      }
    })
    secondData.forEach((entry) => {
      if (entry.year === selectedYear && !excludedSet.has(entry.category)) {
        expense[entry.month] += entry.amount
      }
    })
    MONTHS.forEach((month) => {
      compareColumnData.push([
        month,
        Number(income[month].toFixed(2)),
        Number(expense[month].toFixed(2))
      ])
    })
    return compareColumnData
  }

  return []
}