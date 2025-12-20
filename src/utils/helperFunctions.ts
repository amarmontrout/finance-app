
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