import { Filter, performRequest } from "../performRequest"
import { TransactionType } from "./models"

// Basic Requests ==============================================================
export const saveTransaction = async ({
  userId,
  body,
}: {
  userId: string
  body: TransactionType
}) => {
  const { data, error } = await performRequest<TransactionType>({
    schema: "Transactions",
    table: "transactions",
    method: "POST",
    userId: userId,
    body: body,
  })

  if (error) throw error

  return data?.[0] ?? null
}

export const getTransactions = async ({
  userId,
  month,
  day,
  year,
  type,
  isPaid,
  isReturn,
  category,
  isDeleted,
}: {
  userId: string
  month?: string
  day?: number
  year?: number
  type?: "income" | "expense"
  isPaid?: boolean
  isReturn?: boolean
  category?: string
  isDeleted?: boolean
}) => {
  const filters: Filter<TransactionType>[] = []

  if (month !== undefined) {
    filters.push({
      column: "date->>month",
      operator: "eq",
      value: month,
    })
  }

  if (day !== undefined) {
    filters.push({
      column: "date->>day",
      operator: "eq",
      value: day,
    })
  }

  if (year !== undefined) {
    filters.push({
      column: "date->>year",
      operator: "eq",
      value: year,
    })
  }

  if (type !== undefined) {
    filters.push({
      column: "type",
      operator: "eq",
      value: type,
    })
  }

  if (isPaid !== undefined) {
    filters.push({
      column: "is_paid",
      operator: "eq",
      value: isPaid,
    })
  }

  if (isReturn !== undefined) {
    filters.push({
      column: "is_return",
      operator: "eq",
      value: isReturn,
    })
  }

  if (category !== undefined) {
    filters.push({
      column: "category",
      operator: "eq",
      value: category,
    })
  }

  if (isDeleted !== undefined) {
    filters.push({
      column: "is_deleted",
      operator: "eq",
      value: isDeleted,
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

export const updateTransaction = async ({
  userId,
  rowId,
  body,
}: {
  userId: string
  rowId: number
  body: Partial<TransactionType>
}) => {
  const { data, error } = await performRequest<TransactionType>({
    schema: "Transactions",
    table: "transactions",
    method: "PATCH",
    userId: userId,
    rowId: rowId,
    body: body,
  })

  if (error) throw error

  return data?.[0] ?? null
}

export const softDeleteTransaction = async ({
  userId,
  transactionId,
}: {
  userId: string
  transactionId: number
}) => {
  await updateTransaction({
    userId: userId,
    rowId: transactionId,
    body: {
      is_deleted: true,
      deleted_at: new Date().toISOString(),
    },
  })
}

export const undoSoftDeleteTransaction = async ({
  userId,
  transactionId,
}: {
  userId: string
  transactionId: number
}) => {
  await updateTransaction({
    userId: userId,
    rowId: transactionId,
    body: {
      is_deleted: false,
      deleted_at: null,
    },
  })
}

export const deleteTransaction = async ({
  userId,
  rowId,
}: {
  userId: string
  rowId: number
}) => {
  const { data, error } = await performRequest<TransactionType>({
    schema: "Transactions",
    table: "transactions",
    method: "DELETE",
    userId: userId,
    rowId: rowId,
  })

  if (error) throw error

  return data?.[0] ?? null
}

// Custom Requests =============================================================
export const getUnpaidTransactions = async ({
  userId,
  month,
  day,
  year,
}: {
  userId: string
  month?: string
  day?: number
  year?: number
}) => {
  const filters: Filter<TransactionType>[] = [
    {
      column: "type",
      operator: "eq",
      value: "expense",
    },
    {
      column: "is_return",
      operator: "eq",
      value: false,
    },
    {
      column: "is_paid",
      operator: "eq",
      value: false,
    },
  ]

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

export const getTransactionsByCategory = async ({
  userId,
  month,
  day,
  year,
  category,
}: {
  userId: string
  month?: string
  day?: number
  year?: number
  category: string
}) => {
  const filters: Filter<TransactionType>[] = [
    {
      column: "category",
      operator: "eq",
      value: category,
    },
  ]

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
