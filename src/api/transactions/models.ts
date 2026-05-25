export type TransactionType = {
  id: number, 
  date: DateType,
  amount: number, 
  category: string, 
  note: string, 
  payment_method: "Debit" | "Credit" | "", 
  type: "income" | "expense", 
  is_paid: boolean, 
  is_return: boolean
}

export type DateType = {
  month: string,
  day: number, 
  year: number
}