import { dbRequestBrowser, Filter } from "../dbRequest"
import {  NewTransactionType } from "@/utils/type"


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
  filters,
}: {
  userId: string
  filters?: Filter<NewTransactionType>[]
}) => {
  const { data, error } = await dbRequestBrowser<NewTransactionType>({
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