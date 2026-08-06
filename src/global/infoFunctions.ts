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
    today: {
      month: MONTHS[today.getMonth()],
      day: today.getDate(),
      year: today.getFullYear(),
    },
  }
}

/**
 * This helper function gets the month and year of the previous month.
 *
 * @returns ISO string for the previous month. YYYY-MM
 */
export const getPreviousMonthYear = ({ isoString }: { isoString: string }) => {
  const [yearStr, monthStr, _] = isoString.split("-")

  let year = Number(yearStr)
  let month = Number(monthStr)

  if (month === 1) {
    month = 12
    year--
  } else {
    month--
  }

  return `${year}-${String(month).padStart(2, "0")}`
}

/**
 * This helper function gets the month and year of next month.
 *
 * @returns ISO string for the next month. YYYY-MM
 */
export const getNextMonthYear = ({ isoString }: { isoString: string }) => {
  const [yearStr, monthStr, _] = isoString.split("-")

  let year = Number(yearStr)
  let month = Number(monthStr)

  if (month === 12) {
    month = 1
    year++
  } else {
    month++
  }

  return `${year}-${String(month).padStart(2, "0")}`
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
export const getDaysInMonth = (isoDate: string) => {
  const [year, month] = isoDate.split("-").map(Number)
  return new Date(year, month, 0).getDate()
}

/**
 * Calculate remaining budget for the month and remaining daily allowance
 */
export const getBudgetInfo = ({
  budget,
  spent,
  date,
}: {
  budget: number
  spent: number
  date: string // YYYY-MM-DD
}) => {
  const [_, __, day] = date.split("-").map(Number)

  const daysInMonth = getDaysInMonth(date)
  const remainingDays = daysInMonth - day
  const remainingBudget = budget - spent

  const budgetPerDay = budget / daysInMonth
  const earnedBudget = budgetPerDay * day
  const budgetLeftToEarn = budgetPerDay * remainingDays

  return {
    remainingDays,
    remainingBudget,
    earnedBudget,
    budgetLeftToEarn,
    budgetPerDay,
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

export const getDaysUntil = ({
  targetDate,
  currentDate,
}: {
  targetDate: Date
  currentDate: Date
}) => {
  const millisecondsPerDay = 1000 * 60 * 60 * 24

  const target = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
  )

  const current = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
  )

  const days = Math.ceil(
    (target.getTime() - current.getTime()) / millisecondsPerDay,
  )

  return Math.max(days, 0)
}
