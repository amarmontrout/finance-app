import { healthStateDarkMode, healthStateLightMode } from "@/globals/colors"
import { MONTH_INDEX, MONTHS } from "@/globals/globals"
import { DateType, WeekType } from "./type"

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
    currentMonth: MONTHS[today.getMonth()],
    passedMonths: MONTHS.slice(0, currentMonthIndex + 1)
  }
}

/**
 * This helper function gets the beginning and end of the current week.
 * 
 * @returns The current week's beginning and end time
*/
export const getWeekBounds = (
  date: DateType,
  weekOffset: number = 0
): WeekType => {
  const d = new Date(date.year, MONTH_INDEX[date.month], date.day)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + weekOffset * 7)
  const day = d.getDay()

  const startOfWeek = new Date(d)
  startOfWeek.setDate(d.getDate() - day)
  
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)

  const toDateType = (d: Date): DateType => ({
    month: MONTHS[d.getMonth()],
    day: d.getDate(),
    year: d.getFullYear(),
  })

  return {
    start: toDateType(startOfWeek),
    end: toDateType(endOfWeek)
  }
}

/**
 * Convert DateType to timestamp for simple comparisons
 */
export const toTimestamp = (date: DateType) =>
  new Date(date.year, MONTH_INDEX[date.month], date.day).getTime()

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

export const getCardColor = (
  currentTheme: string | undefined, 
  state: keyof typeof healthStateLightMode
) => {
  if (currentTheme === "light") {
    return healthStateLightMode[state]
  }
  
  return healthStateDarkMode[state]
}

/**
 * Returns how many days in the provided month
 */
export const getDaysInMonth = (month: string, year: number) => {
  const monthIndex = MONTHS.indexOf(month)
  return new Date(year, monthIndex + 1, 0).getDate()
}

/**
 * Calculate remaining budget for the month and remaining daily allowance
 */
export const calculateDailyBudget = ({
  monthlyBudget,
  spentSoFar,
  date
}: {
  monthlyBudget: number;
  spentSoFar: number;
  date: DateType;
}) => {
  const daysInMonth = getDaysInMonth(date.month, date.year);

  const remainingDays = daysInMonth - date.day + 1;
  const remainingBudget = monthlyBudget - spentSoFar;

  const dailyAllowance = remainingBudget > 0 ? 
    remainingBudget / remainingDays : 0;

  return {
    remainingDays,
    remainingBudget,
    dailyAllowance,
  };
}