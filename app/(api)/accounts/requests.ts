import { getAuthenticatedSupabase } from "../getAuthenticatedSupabase"
import { Schemas, Tables } from "../supabase/models"
import { AccountType, CreateAccountType } from "./models"

export const createAccount = async ({ body }: { body: CreateAccountType }) => {
  const { sb, user } = await getAuthenticatedSupabase()
  const { data, error } = await sb
    .schema(Schemas.V2)
    .from(Tables.Accounts)
    .insert({ ...body, user_id: user.id })
    .select()
    .single()
  if (error) {
    throw error
  }
  return data
}

export const getAllAccounts = async () => {
  const { sb, user } = await getAuthenticatedSupabase()
  const { data, error } = await sb
    .schema(Schemas.V2)
    .from(Tables.Accounts)
    .select("*")
    .eq("user_id", user.id)
    .is("deleted_at", null)
  if (error) {
    throw error
  }
  return data
}

export const updateAccount = async ({
  accountId,
  body,
}: {
  accountId: string
  body: Partial<AccountType>
}) => {
  const { sb, user } = await getAuthenticatedSupabase()
  const { data, error } = await sb
    .schema(Schemas.V2)
    .from(Tables.Accounts)
    .update(body)
    .eq("account_id", accountId)
    .eq("user_id", user.id)
    .select()
    .single()
  if (error) {
    throw error
  }
  return data
}

export const softDeleteAccount = async ({
  accountId,
}: {
  accountId: string
}) => {
  const { sb, user } = await getAuthenticatedSupabase()
  const { data, error } = await sb
    .schema(Schemas.V2)
    .from(Tables.Accounts)
    .update({ deleted_at: new Date().toISOString() })
    .eq("account_id", accountId)
    .eq("user_id", user.id)
    .select()
    .single()
  if (error) {
    throw error
  }
  return data
}

export const hardDeleteAccount = async ({
  accountId,
}: {
  accountId: string
}) => {
  const { sb, user } = await getAuthenticatedSupabase()
  const { data, error } = await sb
    .schema(Schemas.V2)
    .from(Tables.Accounts)
    .delete()
    .eq("account_id", accountId)
    .eq("user_id", user.id)
    .select()
    .single()
  if (error) {
    throw error
  }
  return data
}
