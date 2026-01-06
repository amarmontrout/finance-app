import { MONTHS } from "@/globals/globals"
import { TransactionData } from "./transactionStorage"
import { Choice } from "@/contexts/categories-context"
import { healthStateDarkMode, healthStateLightMode } from "@/globals/colors"

/**
 * This helper function gets the current year and month.
 * 
 * @returns The current year and current month
 */
export const getCurrentDateInfo = () => {
  const today = new Date()
  return {
    currentYear: String(today.getFullYear()),
    currentMonth: MONTHS[today.getMonth()]
  }
}

/**
 * This helper function gets the beginning and end of the current week.
 * 
 * @returns The current week's beginning and end time
 */
export const getWeekBounds = (date = new Date()) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)

  const day = d.getDay() // 0 = Sunday
  const startOfWeek = new Date(d)
  startOfWeek.setDate(d.getDate() - day)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)

  return {
    start: startOfWeek.getTime(),
    end: endOfWeek.getTime(),
  }
}


/**
 * This helper function converts a string number to a number.
 * It also removes any commas.
 * 
 * @param str 
 * @returns A number without the commas
 */
export const cleanNumber = (
  str: string
): number => {
  return Number(str.replace(/[^0-9.-]+/g,""))
}

/**
 * This helper function converts a number to a formatted string.
 * It adds commas.
 * 
 * @param num
 * @returns A formatted number string
 */
export const formattedStringNumber = (
  num: number
): string => {
  return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
  })
}

/**
 * This helper function removes commas from a string.
 * 
 * @param value 
 * @returns A string without the commas
 */
export const removeCommas = (value: string) => value.replace(/,/g, "")

/**
 * This helper function creates a random string id.
 * 
 * @param length
 * @returns A randomized string of given length.
 */
export const makeId = (
  length: number
): string => {
    let result = ""
    const characters = "0123456789"
    const charLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charLength))
    }
    return result
}

export type FlatTransaction = {
  id: string
  year: string
  month: string
  category: string
  amount: string
}
/**
 * This helper function makes the TransactionData more manageable.
 * 
 * @param data
 * @returns An array for better manipulation of TransactionData
 */
export const flattenTransactions = (
  data: TransactionData
): FlatTransaction[] => {
  const result: FlatTransaction[] = []
  for (const year in data) {
    for (const month in data[year]) {
      for (const tx of data[year][month]) {
        result.push({
          id: tx.id,
          year,
          month,
          category: tx.category,
          amount: tx.amount
        })
      }
    }
  }
  return result
}

/**
 * This helper function gets the state of the current savings rate.
 * 
 * @returns A string depicting the health state
 */
export const getSavingsHealthState = (net: number, total: number) => {
  if (total === 0) return "concerning"

  const percent = net / total

  // '<= 0' becaue total = 100 when calculated by the savings rate percent
  if (percent <= 0) return "concerning"
  if (percent <= 0.05) return "ok"
  if (percent <= 0.1) return "average"
  if (percent <= 0.15) return "great"
  return "excellent"
}

/**
 * This helper function gets the previous month info for comparison
 * 
 * @returns An object with the previous month's year and month.
 */
export const getPreviousMonthInfo = (year: string, month: string) => {
  const monthIndex = MONTHS.indexOf(month)

  if (monthIndex > 0) {
    return {
      year,
      month: MONTHS[monthIndex - 1]
    }
  }

  return {
    year: String(Number(year) - 1),
    month: MONTHS[11]
  }
}

export const getExcludedCategorySet = (
  categories: Choice[]
): Set<string> =>
  new Set(
    categories
      .filter((c) => c.isExcluded)
      .map((c) => c.name)
  )

export const getCardColor = (
  currentTheme: string | undefined, 
  state: keyof typeof healthStateLightMode
) => {
  if (currentTheme === "light") {
    return healthStateLightMode[state]
  }
  
  return healthStateDarkMode[state]
}