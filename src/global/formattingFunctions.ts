import { DateType } from "@/api/transactions/models"
import { MONTH_INDEX, MONTHS } from "./objects"

/**
 * This helper function converts a number to a formatted string.
 * It adds commas.
 *
 * @param num
 * @returns A formatted number string
 */
export const numberToString = (num: number): string => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Convert DateType to timestamp for simple comparisons
 */
export const dateTypeToTimestamp = (date: DateType) =>
  new Date(date.year, MONTH_INDEX[date.month], date.day).getTime()

/**
 * Convert Date to DateType
 */
export const dateToDateType = (date: Date): DateType => ({
  month: MONTHS[date.getMonth()],
  day: date.getDate(),
  year: date.getFullYear(),
})

/**
 * Convert timestamp to date string as "Month Day, Year"
 */
export function timestampToDateString(
  timestamp: number,
  locale = "en-US",
): string {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(timestamp))
}
