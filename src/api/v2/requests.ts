import { Filter, performRequestV2 } from "../performRequestV2"
import {
  Tables,
  V2AccountType,
  V2BudgetType,
  V2CategoryType,
  V2CreateAccountType,
  V2CreateBudgetType,
  V2CreateCategoryType,
  V2CreateMerchantType,
  V2CreateTransactionType,
  V2MerchantType,
  V2TransactionType,
} from "./models"

// GET =========================================================================
export const getAccountsV2 = async ({
  filters,
}: {
  filters?: Filter<V2AccountType>[]
}) => {
  const { data, error } = await performRequestV2<V2AccountType>({
    table: Tables.Accounts,
    method: "GET",
    filters: filters,
  })

  if (error) throw error
  return data
}

export const getBudgetsV2 = async ({
  filters,
}: {
  filters?: Filter<V2BudgetType>[]
}) => {
  const { data, error } = await performRequestV2<V2BudgetType>({
    table: Tables.Budgets,
    method: "GET",
    filters: filters,
  })

  if (error) throw error
  return data
}

export const getCategoriesV2 = async ({
  filters,
}: {
  filters?: Filter<V2CategoryType>[]
}) => {
  const { data, error } = await performRequestV2<V2CategoryType>({
    table: Tables.Categories,
    method: "GET",
    filters: filters,
  })

  if (error) throw error
  return data
}

export const getMerchantsV2 = async ({
  filters,
}: {
  filters?: Filter<V2MerchantType>[]
}) => {
  const { data, error } = await performRequestV2<V2MerchantType>({
    table: Tables.Merchants,
    method: "GET",
    filters: filters,
  })

  if (error) throw error
  return data
}

export const getTransactionsV2 = async ({
  filters,
}: {
  filters?: Filter<V2TransactionType>[]
}) => {
  const { data, error } = await performRequestV2<V2TransactionType>({
    table: Tables.Transactions,
    method: "GET",
    filters: filters,
  })

  if (error) throw error
  return data
}

// UPDATE ======================================================================
export const updateAccountV2 = async ({
  rowId,
  body,
}: {
  rowId: string
  body: Partial<V2AccountType>
}) => {
  const { data, error } = await performRequestV2<Partial<V2AccountType>>({
    table: Tables.Accounts,
    method: "PATCH",
    rowId: rowId,
    body: body,
  })

  if (error) throw error

  return data?.[0] ?? null
}

export const updateBudgetV2 = async ({
  rowId,
  body,
}: {
  rowId: string
  body: Partial<V2BudgetType>
}) => {
  const { data, error } = await performRequestV2<Partial<V2BudgetType>>({
    table: Tables.Budgets,
    method: "PATCH",
    rowId: rowId,
    body: body,
  })

  if (error) throw error

  return data?.[0] ?? null
}

export const updateCategoryV2 = async ({
  rowId,
  body,
}: {
  rowId: string
  body: Partial<V2CategoryType>
}) => {
  const { data, error } = await performRequestV2<Partial<V2CategoryType>>({
    table: Tables.Categories,
    method: "PATCH",
    rowId: rowId,
    body: body,
  })

  if (error) throw error

  return data?.[0] ?? null
}

export const updateMerchantV2 = async ({
  rowId,
  body,
}: {
  rowId: string
  body: Partial<V2MerchantType>
}) => {
  const { data, error } = await performRequestV2<Partial<V2MerchantType>>({
    table: Tables.Merchants,
    method: "PATCH",
    rowId: rowId,
    body: body,
  })

  if (error) throw error

  return data?.[0] ?? null
}

export const updateTransactionV2 = async ({
  rowId,
  body,
}: {
  rowId: string
  body: Partial<V2TransactionType>
}) => {
  const { data, error } = await performRequestV2<Partial<V2TransactionType>>({
    table: Tables.Transactions,
    method: "PATCH",
    rowId: rowId,
    body: body,
  })

  if (error) throw error

  return data?.[0] ?? null
}

// POST ========================================================================
export const saveAccountV2 = async ({
  body,
}: {
  body: V2CreateAccountType
}) => {
  const { data, error } = await performRequestV2<V2CreateAccountType>({
    table: Tables.Accounts,
    method: "POST",
    body: body,
  })

  if (error) throw error

  return data?.[0] ?? null
}

export const saveBudgetV2 = async ({ body }: { body: V2CreateBudgetType }) => {
  const { data, error } = await performRequestV2<V2CreateBudgetType>({
    table: Tables.Budgets,
    method: "POST",
    body: body,
  })

  if (error) throw error

  return data?.[0] ?? null
}

export const saveCategoryV2 = async ({
  body,
}: {
  body: V2CreateCategoryType
}) => {
  const { data, error } = await performRequestV2<V2CreateCategoryType>({
    table: Tables.Categories,
    method: "POST",
    body: body,
  })

  if (error) throw error

  return data?.[0] ?? null
}

export const saveMerchantsV2 = async ({
  body,
}: {
  body: V2CreateMerchantType
}) => {
  const { data, error } = await performRequestV2<V2CreateMerchantType>({
    table: Tables.Merchants,
    method: "POST",
    body: body,
  })

  if (error) throw error

  return data?.[0] ?? null
}

export const saveTransactionV2 = async ({
  body,
}: {
  body: V2CreateTransactionType
}) => {
  const { data, error } = await performRequestV2<V2CreateTransactionType>({
    table: Tables.Transactions,
    method: "POST",
    body: body,
  })

  if (error) throw error

  return data?.[0] ?? null
}
