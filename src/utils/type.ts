import { AlertColor } from "@mui/material"

export type HookSetter<T> = React.Dispatch<React.SetStateAction<T>>

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

export type BudgetType = {
  id: number,
  category: string,
  amount: number
}

export type ChoiceType = {
  id: number,
  name: string
  isExcluded?: boolean
  isRecurring?: boolean
}

export type DateType = {
  month: string,
  day: number, 
  year: number
}

export type SelectedDateType = {
  month: string
  year: number
}

export type WeekType = {
  start: DateType
  end: DateType
}

export type AlertToastType = {
  open: boolean
  onClose: () => void
  severity: AlertColor
  message: string
}