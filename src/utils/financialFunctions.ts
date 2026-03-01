export const getNetCashFlow = (
  income: number, 
  expense: number
) => {
  const incomeNumber = income
  const expenseNumber = expense

  return incomeNumber-expenseNumber
}

export const getSavingRate = (
  income: number, 
  expense: number
) => {
  const incomeNumber = income
  const expenseNumber = expense
  if (incomeNumber === 0) return 0
  const savingsRate = (incomeNumber-expenseNumber)/incomeNumber
  return savingsRate * 100
}

export const getAnnualProjection = (
  ytdTotal: number, 
  ytdMonths: number
) => {
  return (ytdTotal/ytdMonths)*12
}

export const getAverage = (
  ytdAmounts: number[],
): number => {
  if (ytdAmounts.length === 0) return 0
  
  const total = ytdAmounts.reduce(
    (sum, amount) => sum + amount,
    0
  )
  return total/ytdAmounts.length
}