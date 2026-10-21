import { getAuthenticatedSupabase } from "../getAuthenticatedSupabase"
import { Schemas, Tables } from "../supabase/models"
import {
  CreateTransactionType,
  TransactionType,
  TransactionTypeValue,
} from "./models"

export const createTransaction = async ({
  body,
}: {
  body: CreateTransactionType
}) => {
  const { sb, user } = await getAuthenticatedSupabase()
  const { data, error } = await sb
    .schema(Schemas.V2)
    .from(Tables.Transactions)
    .insert({ ...body, user_id: user.id })
    .select()
    .single()
  if (error) {
    throw error
  }
  return data
}

export const getDeletedTransactions = async () => {
  const { sb, user } = await getAuthenticatedSupabase()
  const { data, error } = await sb
    .schema(Schemas.V2)
    .from(Tables.Transactions)
    .select(
      `
      *,
      category:categories (
        name
      ),
      account:accounts (
        name
      ),
      merchant:merchants (
        name
      )
    `,
    )
    .eq("user_id", user.id)
    .not("deleted_at", "is", null)
    .order("transaction_date", { ascending: false })
  if (error) {
    throw error
  }
  return data as TransactionType[]
}

export const getTransactions = async ({
  start,
  end,
  accountId,
  merchantId,
  categoryId,
  parentTransactionId,
  transactionType,
  isPaid,
}: {
  start: string
  end: string
  accountId?: string
  merchantId?: string
  categoryId?: string
  parentTransactionId?: string
  transactionType?: TransactionTypeValue[]
  isPaid?: boolean
}) => {
  const { sb, user } = await getAuthenticatedSupabase()

  let query = sb
    .schema(Schemas.V2)
    .from(Tables.Transactions)
    .select(
      `
      *,
      category:categories (
        name
      ),
      account:accounts (
        name
      ),
      merchant:merchants (
        name
      )
    `,
    )
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .gte("transaction_date", start)
    .lte("transaction_date", end)

  if (accountId !== undefined) {
    query = query.eq("account_id", accountId)
  }
  if (merchantId !== undefined) {
    query = query.eq("merchant_id", merchantId)
  }
  if (categoryId !== undefined) {
    query = query.eq("category_id", categoryId)
  }
  if (parentTransactionId !== undefined) {
    query = query.eq("parent_transaction_id", parentTransactionId)
  }
  if (transactionType !== undefined && transactionType.length > 0) {
    query = query.in("transaction_type", transactionType)
  }
  if (isPaid !== undefined) {
    query = query.eq("is_paid", isPaid)
  }

  const { data, error } = await query.order("transaction_date", {
    ascending: false,
  })
  if (error) {
    throw error
  }
  return data as TransactionType[]
}

export const updateTransaction = async ({
  transactionId,
  body,
}: {
  transactionId: string
  body: Partial<CreateTransactionType>
}) => {
  const { sb, user } = await getAuthenticatedSupabase()
  const { data, error } = await sb
    .schema(Schemas.V2)
    .from(Tables.Transactions)
    .update(body)
    .eq("transaction_id", transactionId)
    .eq("user_id", user.id)
    .select()
    .single()
  if (error) {
    throw error
  }
  return data
}

export const softDeleteTransaction = async ({
  transactionId,
}: {
  transactionId: string
}) => {
  const { sb, user } = await getAuthenticatedSupabase()
  const { data, error } = await sb
    .schema(Schemas.V2)
    .from(Tables.Transactions)
    .update({ deleted_at: new Date().toISOString() })
    .eq("transaction_id", transactionId)
    .eq("user_id", user.id)
    .select()
    .single()
  if (error) {
    throw error
  }
  return data
}

export const hardDeleteTransaction = async ({
  transactionId,
}: {
  transactionId: string
}) => {
  const { sb, user } = await getAuthenticatedSupabase()
  const { data, error } = await sb
    .schema(Schemas.V2)
    .from(Tables.Transactions)
    .delete()
    .eq("transaction_id", transactionId)
    .eq("user_id", user.id)
    .select()
    .single()
  if (error) {
    throw error
  }
  return data
}
