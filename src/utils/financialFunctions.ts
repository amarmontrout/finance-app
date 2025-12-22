import { cleanNumber, formattedStringNumber } from "./helperFunctions"

export const getNetCashFlow = (income: string, expense: string) => {
  const incomeNumber = cleanNumber(income)
  const expenseNumber = cleanNumber(expense)
  return formattedStringNumber(incomeNumber-expenseNumber)
}

export const getSavingRate = (income: string, expense: string) => {
  const incomeNumber = cleanNumber(income)
  const expenseNumber = cleanNumber(expense)
  if (incomeNumber === 0) return "0.00"
  const savingsRate = (incomeNumber-expenseNumber)/incomeNumber
  return formattedStringNumber(savingsRate * 100)
}

export const getAnnualProjection = (ytdTotal: number, ytdMonths: number) => {
  return formattedStringNumber((ytdTotal/ytdMonths)*12)
}