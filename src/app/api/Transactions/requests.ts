import { dbRequestBrowser } from "../dbRequest"
import { BudgetEntryTypeV2, TransactionTypeV2 } from "@/utils/type"

export const saveIncome = async ({
  userId,
  body
}: {
  userId: string
  body: TransactionTypeV2
}) => {
  const {data, error} = await dbRequestBrowser({
    schema: "Transactions",
    table: "income",
    method: "POST",
    userId: userId,
    body: body
  })
    
  if (error) {
    console.error(error)
    return null
  }

  return data
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
    
  if (error) {
    console.error(error)
    return null
  }

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
  const {data, error} = await dbRequestBrowser({
    schema: "Transactions",
    table: "income",
    method: "PATCH",
    userId: userId,
    rowId: rowId,
    body: body
  })
    
  if (error) {
    console.error(error)
    return null
  }

  return data
}

export const deleteIncome = async ({
  userId,
  rowId,
}: {
  userId: string
  rowId: number
}) => {
  const {data, error} = await dbRequestBrowser({
    schema: "Transactions",
    table: "income",
    method: "DELETE",
    userId: userId,
    rowId: rowId
  })
    
  if (error) {
    console.error(error)
    return null
  }

  return data
}


export const saveExpenses = async ({
  userId,
  body
}: {
  userId: string
  body: {
    id: number,
    month: string,
    year: number,
    category: string,
    amount: number
  }
}) => {
  const {data, error} = await dbRequestBrowser({
    schema: "Transactions",
    table: "expenses",
    method: "POST",
    userId: userId,
    body: body
  })
    
  if (error) {
    console.error(error)
    return null
  }

  return data
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
    
  if (error) {
    console.error(error)
    return null
  }

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
  const {data, error} = await dbRequestBrowser({
    schema: "Transactions",
    table: "expenses",
    method: "PATCH",
    userId: userId,
    rowId: rowId,
    body: body
  })
    
  if (error) {
    console.error(error)
    return null
  }

  return data
}

export const deleteExpense = async ({
  userId,
  rowId,
}: {
  userId: string
  rowId: number
}) => {
  const {data, error} = await dbRequestBrowser({
    schema: "Transactions",
    table: "expenses",
    method: "DELETE",
    userId: userId,
    rowId: rowId
  })
    
  if (error) {
    console.error(error)
    return null
  }

  return data
}


export const saveBudget = async ({
  userId,
  body
}: {
  userId: string
  body: BudgetEntryTypeV2
}) => {
  const {data, error} = await dbRequestBrowser({
    schema: "Transactions",
    table: "budget",
    method: "POST",
    userId: userId,
    body: body
  })
    
  if (error) {
    console.error(error)
    return null
  }

  return data
}

export const getBudget = async ({
  userId,
}: {
  userId: string
}) => {
  const {data, error} = await dbRequestBrowser<BudgetEntryTypeV2>({
    schema: "Transactions",
    table: "budget",
    method: "GET",
    userId: userId
  })
    
  if (error) {
    console.error(error)
    return null
  }

  return data
}

export const updateBudget = async ({
  userId,
  rowId,
  body
}: {
  userId: string
  rowId: number
  body: BudgetEntryTypeV2
}) => {
  const {data, error} = await dbRequestBrowser({
    schema: "Transactions",
    table: "budget",
    method: "PATCH",
    userId: userId,
    rowId: rowId,
    body: body
  })
    
  if (error) {
    console.error(error)
    return null
  }

  return data
}

export const deleteBudget = async ({
  userId,
  rowId,
}: {
  userId: string
  rowId: number
}) => {
  const {data, error} = await dbRequestBrowser({
    schema: "Transactions",
    table: "budget",
    method: "DELETE",
    userId: userId,
    rowId: rowId
  })
    
  if (error) {
    console.error(error)
    return null
  }

  return data
}