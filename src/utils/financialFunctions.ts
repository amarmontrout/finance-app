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

export const getAverage = (data: number[], month: number): number => {
  let total = 0

  data.map((amount) => {
    total += amount
  })

  return total/month
}

export const getDifference = (prev: number, current: number) => {
  return current-prev
}