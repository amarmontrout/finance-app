import { getAuthenticatedSupabase } from "../getAuthenticatedSupabase"
import { Schemas, Tables } from "../supabase/models"
import { CreateTransactionType } from "./models"

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
  return data
}

export const getTransactions = async ({
  startOfMonth,
  endOfMonth,
}: {
  startOfMonth: string
  endOfMonth: string
}) => {
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
    .is("deleted_at", null)
    .gte("transaction_date", startOfMonth)
    .lte("transaction_date", endOfMonth)
    .order("transaction_date", { ascending: false })
  if (error) {
    throw error
  }
  return data
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
