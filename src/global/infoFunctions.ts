import { DateType } from "@/api/transactions/models"
import { WeekType } from "@/types/types"
import { MONTH_INDEX, MONTHS } from "./objects"

/**
 * This helper function gets the current year and month.
 *
 * @returns The current year and current month
 */
export const getCurrentDateInfo = () => {
  const today = new Date()
  const currentMonthIndex = today.getMonth()
  return {
    currentYear: today.getFullYear(),
    currentDay: today.getDate(),
    currentMonthString: MONTHS[today.getMonth()],
    currentMonthNumber: today.getMonth() + 1,
    passedMonths: MONTHS.slice(0, currentMonthIndex + 1),
  }
}

/**
 * This helper function gets the previous year and month.
 *
 * @returns The previous year and previous month
 */
export const getPreviousMonthInfo = ({
  currentMonthString,
  currentYear,
}: {
  currentMonthString: string
  currentYear: number
}) => {
  const currentMonthIndex = MONTH_INDEX[currentMonthString]
  const previousMonthIndex =
    currentMonthIndex === 0 ? 11 : currentMonthIndex - 1
  const previousYear = currentMonthIndex === 0 ? currentYear - 1 : currentYear
  const previousMonthString = MONTHS[previousMonthIndex]
  return {
    previousYear: previousYear,
    previousMonthString: previousMonthString,
  }
}

/**
 * This helper function gets the beginning and end of the current week.
 *
 * @returns The current week's beginning and end time
 */
export const getWeekBounds = (
  date: DateType,
  weekOffset: number = 0,
): WeekType => {
  const d = new Date(date.year, MONTH_INDEX[date.month], date.day)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + weekOffset * 7)
  const day = d.getDay()

  const startOfWeek = new Date(d)
  startOfWeek.setDate(d.getDate() - day)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)

  return {
    start: startOfWeek.getTime(),
    end: endOfWeek.getTime(),
  }
}

/**
 * Returns how many days in the provided month
 */
export const getDaysInMonth = (month: string, year: number) => {
  const monthIndex = MONTH_INDEX[month]
  return new Date(year, monthIndex + 1, 0).getDate()
}

/**
 * Calculate remaining budget for the month and remaining daily allowance
 */
export const getBudgetInfo = ({
  monthlyBudget,
  spentSoFar,
  date,
}: {
  monthlyBudget: number
  spentSoFar: number
  date: DateType
}) => {
  const daysInMonth = getDaysInMonth(date.month, date.year)
  const remainingDays = daysInMonth - date.day
  const remainingBudget = monthlyBudget - spentSoFar

  const budgetPerDay = monthlyBudget / daysInMonth
  const earnedBudget = budgetPerDay * date.day
  const budgetLeftToEarn = budgetPerDay * remainingDays

  return {
    remainingDays,
    remainingBudget,
    earnedBudget,
    budgetLeftToEarn,
  }
}

/**
 * This helper function creates a random string id.
 *
 * @returns A randomized string of given length.
 */
export const makeId = (): number => {
  let result = ""
  const characters = "123456789"
  const charLength = characters.length

  const array = new Uint8Array(16)
  crypto.getRandomValues(array)

  for (let i = 0; i < 16; i++) {
    result += characters[array[i] % charLength]
  }

  return Number(result)
}
