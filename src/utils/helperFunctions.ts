import { MONTHS } from "@/globals/globals"

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
 * This helper function converts a string number to a number.
 * It also removes any commas.
 * 
 * @param str 
 * @returns A number without the commas
 */
export const cleanNumber = (str: string) => {
  return Number(str.replace(/[^0-9.-]+/g,""))
}

/**
 * This helper function converts a number to a formatted string.
 * It adds commas.
 * 
 * @param num
 * @returns A formatted number string
 */
export const formattedStringNumber = (num: number) => {
  return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
  })
}

/**
 * This helper function creates a random string id.
 * 
 * @param length
 * @returns A randomized string of given length.
 */
export const makeId = (length: number) => {
    let result = ""
    const characters = "0123456789"
    const charLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charLength))
    }
    return result
}