import { dbRequestBrowser } from "../dbRequest"
import { BudgetTransactionTypeV2, NewTransactionType, TransactionTypeV2 } from "@/utils/type"

export const saveIncome = async ({
  userId,
  body
}: {
  userId: string
  body: TransactionTypeV2
}) => {
  const {data, error} = await dbRequestBrowser<TransactionTypeV2>({
    schema: "Transactions",
    table: "income",
    method: "POST",
    userId: userId,
    body: body
  })
    
  if (error) throw error

  return data?.[0] ?? null
}

export const getIncome = async ({
  userId,
}: {
  userId: string
}) => {
  const {data, error} = await dbRequestBrowser<TransactionTypeV2>({
    schema: "Transactions",
    table: "income",
    method: "GET",
    userId: userId
  })
    
  if (error) throw error

  return data
}

export const updateIncome = async ({
  userId,
  rowId,
  body
}: {
  userId: string
  rowId: number
  body: TransactionTypeV2
}) => {
  const {data, error} = await dbRequestBrowser<TransactionTypeV2>({
    schema: "Transactions",
    table: "income",
    method: "PATCH",
    userId: userId,
    rowId: rowId,
    body: body
  })
    
  if (error) throw error

  return data?.[0] ?? null
}

export const deleteIncome = async ({
  userId,
  rowId,
}: {
  userId: string
  rowId: number
}) => {
  const {data, error} = await dbRequestBrowser<TransactionTypeV2>({
    schema: "Transactions",
    table: "income",
    method: "DELETE",
    userId: userId,
    rowId: rowId
  })
    
  if (error) throw error

  return data?.[0] ?? null
}


export const saveExpense = async ({
  userId,
  body
}: {
  userId: string
  body: TransactionTypeV2
}) => {
  const {data, error} = await dbRequestBrowser<TransactionTypeV2>({
    schema: "Transactions",
    table: "expenses",
    method: "POST",
    userId: userId,
    body: body
  })
    
  if (error) throw error

  return data?.[0] ?? null
}

export const getExpenses = async ({
  userId,
}: {
  userId: string
}) => {
  const {data, error} = await dbRequestBrowser<TransactionTypeV2>({
    schema: "Transactions",
    table: "expenses",
    method: "GET",
    userId: userId
  })
    
  if (error) throw error

  return data
}

export const updateExpense = async ({
  userId,
  rowId,
  body
}: {
  userId: string
  rowId: number
  body: TransactionTypeV2
}) => {
  const {data, error} = await dbRequestBrowser<TransactionTypeV2>({
    schema: "Transactions",
    table: "expenses",
    method: "PATCH",
    userId: userId,
    rowId: rowId,
    body: body
  })
    
  if (error) throw error

  return data?.[0] ?? null
}

export const deleteExpense = async ({
  userId,
  rowId,
}: {
  userId: string
  rowId: number
}) => {
  const {data, error} = await dbRequestBrowser<TransactionTypeV2>({
    schema: "Transactions",
    table: "expenses",
    method: "DELETE",
    userId: userId,
    rowId: rowId
  })
    
  if (error) throw error

  return data?.[0] ?? null
}


export const saveBudget = async ({
  userId,
  body
}: {
  userId: string
  body: BudgetTransactionTypeV2
}) => {
  const {data, error} = await dbRequestBrowser<BudgetTransactionTypeV2>({
    schema: "Transactions",
    table: "budget",
    method: "POST",
    userId: userId,
    body: body
  })
    
  if (error) throw error

  return data?.[0] ?? null
}

export const getBudget = async ({
  userId,
}: {
  userId: string
}) => {
  const {data, error} = await dbRequestBrowser<BudgetTransactionTypeV2>({
    schema: "Transactions",
    table: "budget",
    method: "GET",
    userId: userId
  })
    
  if (error) throw error

  return data
}

export const updateBudget = async ({
  userId,
  rowId,
  body
}: {
  userId: string
  rowId: number
  body: BudgetTransactionTypeV2
}) => {
  const {data, error} = await dbRequestBrowser<BudgetTransactionTypeV2>({
    schema: "Transactions",
    table: "budget",
    method: "PATCH",
    userId: userId,
    rowId: rowId,
    body: body
  })
    
  if (error) throw error

  return data?.[0] ?? null
}

export const deleteBudget = async ({
  userId,
  rowId,
}: {
  userId: string
  rowId: number
}) => {
  const {data, error} = await dbRequestBrowser<BudgetTransactionTypeV2>({
    schema: "Transactions",
    table: "budget",
    method: "DELETE",
    userId: userId,
    rowId: rowId
  })
    
  if (error) throw error

  return data?.[0] ?? null
}





export const saveTransaction = async ({
  userId,
  body
}: {
  userId: string
  body: NewTransactionType
}) => {
  const {data, error} = await dbRequestBrowser<NewTransactionType>({
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
}: {
  userId: string
}) => {
  const {data, error} = await dbRequestBrowser<NewTransactionType>({
    schema: "Transactions",
    table: "transactions",
    method: "GET",
    userId: userId
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
  body: NewTransactionType
}) => {
  const {data, error} = await dbRequestBrowser<NewTransactionType>({
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
  const {data, error} = await dbRequestBrowser<NewTransactionType>({
    schema: "Transactions",
    table: "transactions",
    method: "DELETE",
    userId: userId,
    rowId: rowId
  })
    
  if (error) throw error

  return data?.[0] ?? null
}