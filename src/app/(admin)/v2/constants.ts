import { FilterOperator } from "@/api/performRequest"

export const CATEGORY_COLORS = [
  "#F44336",
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#3F51B5",
  "#2196F3",
  // "#03A9F4",
  "#00BCD4",
  "#009688",
  "#4CAF50",
  // "#8BC34A",
  "#CDDC39",
  "#FFC107",
  "#FF9800",
  "#795548",
]

export const DEFAULT_TRANSACTION_TYPES = [
  "Income",
  "Expense",
  "Refund",
  "Return",
]

export const DEFAULT_STATUS = [
  { value: "Unpaid", label: "Unpaid" },
  { value: "Paid", label: "Paid" },
]

export const DEFAULT_ACCOUNT_TYPES = [
  { value: "Checking", label: "Checking" },
  { value: "Savings", label: "Savings" },
  { value: "Credit Card", label: "Credit Card" },
]

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

// FILTERS =====================================================================

export const NOT_DELETED_FILTER = {
  column: "deleted_at",
  operator: "eq" as FilterOperator,
  value: null,
}

export const START_DATE_FILTER = (startDate: string) => {
  return {
    column: "transaction_date",
    operator: "gte" as FilterOperator,
    value: startDate,
  }
}

export const END_DATE_FILTER = (endDate: string) => {
  return {
    column: "transaction_date",
    operator: "lt" as FilterOperator,
    value: endDate,
  }
}

export const TYPE_FILTER = (type: string) => {
  return {
    column: "transaction_type",
    operator: "eq" as FilterOperator,
    value: type,
  }
}
