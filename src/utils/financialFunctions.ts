import { cleanNumber, formattedStringNumber } from "./helperFunctions"

export const getNetCashFlow = (
  income: string, 
  expense: string
) => {
  const incomeNumber = cleanNumber(income)
  const expenseNumber = cleanNumber(expense)
  return formattedStringNumber(incomeNumber-expenseNumber)
}

export const getSavingRate = (
  income: string, 
  expense: string
) => {
  const incomeNumber = cleanNumber(income)
  const expenseNumber = cleanNumber(expense)
  if (incomeNumber === 0) return "0.00"
  const savingsRate = (incomeNumber-expenseNumber)/incomeNumber
  return formattedStringNumber(savingsRate * 100)
}

export const getAnnualProjection = (
  ytdTotal: number, 
  ytdMonths: number
) => {
  return (ytdTotal/ytdMonths)*12
}

export const getAverage = (
  ytdAmounts: number[], 
  ytdMonths: number
): number => {
  let total = 0
  ytdAmounts.map((amount) => {
    total += amount
  })
  return total/ytdMonths
}

export const getDifference = (
  previousAmount: number, 
  currentAmount: number
) => {
  return currentAmount-previousAmount
}