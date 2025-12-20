
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