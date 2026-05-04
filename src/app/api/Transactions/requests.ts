import { TransactionType } from "@/utils/type"
import { Filter, performRequest } from "../performRequest"

// Basic Requests ==============================================================
export const saveTransaction = async ({
  userId,
  body
}: {
  userId: string
  body: TransactionType
}) => {
  const {data, error} = await performRequest<TransactionType>({
    schema: "Transactions",
    table: "transactions",
    method: "POST",
    userId: userId,
    body: body
  })
    
  if (error) throw error

  return data?.[0] ?? null
}

export const getTransactions = async ({
  userId,
  filters,
}: {
  userId: string
  filters?: Filter<TransactionType>[]
}) => {
  const { data, error } = await performRequest<TransactionType>({
    schema: "Transactions",
    table: "transactions",
    method: "GET",
    userId,
    filters: filters ?? []
  })

  if (error) throw error
  return data
}

export const updateTransaction = async ({
  userId,
  rowId,
  body
}: {
  userId: string
  rowId: number
  body: TransactionType
}) => {
  const {data, error} = await performRequest<TransactionType>({
    schema: "Transactions",
    table: "transactions",
    method: "PATCH",
    userId: userId,
    rowId: rowId,
    body: body
  })
    
  if (error) throw error

  return data?.[0] ?? null
}

export const deleteTransaction = async ({
  userId,
  rowId,
}: {
  userId: string
  rowId: number
}) => {
  const {data, error} = await performRequest<TransactionType>({
    schema: "Transactions",
    table: "transactions",
    method: "DELETE",
    userId: userId,
    rowId: rowId
  })
    
  if (error) throw error

  return data?.[0] ?? null
}

// Custom Requests =============================================================
export const getTransactionsWithFilter = async ({
  userId,
  month,
  day,
  year,
  type,
  isPaid,
  isReturn,
  category
}: {
  userId: string
  month?: string
  day?: number
  year?: number
  type?: "income" | "expense"
  isPaid?: boolean
  isReturn?: boolean
  category?: string
}) => {
  const filters: Filter<TransactionType>[] = []

  if (month) {
    filters.push({
      column: "date->>month",
      operator: "eq",
      value: month,
    })
  }

  if (day) {
    filters.push({
      column: "date->>day",
      operator: "eq",
      value: day,
    })
  }

  if (year) {
    filters.push({
      column: "date->>year",
      operator: "eq",
      value: year,
    })
  }

  if (type) {
    filters.push({
      column: "type",
      operator: "eq",
      value: type,
    })
  }

  if (isPaid) {
    filters.push({
      column: "is_paid",
      operator: "eq",
      value: isPaid,
    })
  }

  if (isReturn) {
    filters.push({
      column: "is_return",
      operator: "eq",
      value: isReturn,
    })
  }

  if (category) {
    filters.push({
      column: "category",
      operator: "eq",
      value: category,
    })
  }

  const { data, error } = await performRequest<TransactionType>({
    schema: "Transactions",
    table: "transactions",
    method: "GET",
    userId,
    filters: filters.length ? filters : undefined,
  })

  if (error) throw error
  return data
}