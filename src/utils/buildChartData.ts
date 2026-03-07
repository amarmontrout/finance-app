import { MONTHS } from "@/globals/globals"
import { NewTransactionType } from "./type"

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
export const buildMultiColumnData = ({
  firstData,
  secondData,
  selectedYear,
  firstColumnTitle,
  method
}: {
  firstData: NewTransactionType[]
  secondData?: NewTransactionType[]
  selectedYear?: number
  firstColumnTitle: string
  method: "self" | "compare"
}): MultiColumnDataType => {
  if (!firstData) return []
  if (method === "self") {
    const years = Array.from(
      new Set(firstData.map(entry => entry.date.year))
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
          if (entry.date.month === month 
            && entry.date.year === year
            && entry.type === "income"
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
      if (
        entry.date.year === selectedYear 
        && entry.type === "income"
      ) {
        income[entry.date.month] += entry.amount
      }
    })
    secondData.forEach((entry) => {
      if (
        entry.date.year === selectedYear 
        && entry.payment_method === "Debit" 
        && entry.type === "expense"
      ) {
        expense[entry.date.month] += entry.amount
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