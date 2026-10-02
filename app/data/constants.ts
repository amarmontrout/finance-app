import { AccountTypeValue } from "../(api)/accounts/models"
import { TransactionTypeValue } from "../(api)/transactions/models"

export const MONTH_INDEX_V2: Record<string, string> = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  "10": "October",
  "11": "November",
  "12": "December",
}

export const DEFAULT_ACCOUNT_TYPES = [
  { value: "Checking", label: "Checking" },
  { value: "Savings", label: "Savings" },
  { value: "Credit Card", label: "Credit Card" },
]

export const DEFAULT_TRANSACTION_TYPES: TransactionTypeValue[] = [
  "Income",
  "Expense",
  "Return",
]

export const DEFUALT_EXPENSE_TYPE: AccountTypeValue[] = [
  "Checking",
  "Credit Card",
]
