import { getAuthenticatedSupabase } from "../getAuthenticatedSupabase"
import { Schemas, Tables } from "../supabase/models"
import { CreateMerchantType, MerchantType } from "./models"

export const createMerchant = async ({
  body,
}: {
  body: CreateMerchantType
}) => {
  const { sb, user } = await getAuthenticatedSupabase()
  const { data, error } = await sb
    .schema(Schemas.V2)
    .from(Tables.Merchants)
    .insert({ ...body, user_id: user.id })
    .select()
    .single()
  if (error) {
    throw error
  }
  return data
}

export const getAllMerchants = async () => {
  const { sb, user } = await getAuthenticatedSupabase()
  const { data, error } = await sb
    .schema(Schemas.V2)
    .from(Tables.Merchants)
    .select("*")
    .eq("user_id", user.id)
    .is("deleted_at", null)
  if (error) {
    throw error
  }
  return data
}

export const updateMerchant = async ({
  merchantId,
  body,
}: {
  merchantId: string
  body: Partial<MerchantType>
}) => {
  const { sb, user } = await getAuthenticatedSupabase()
  const { data, error } = await sb
    .schema(Schemas.V2)
    .from(Tables.Merchants)
    .update(body)
    .eq("merchant_id", merchantId)
    .eq("user_id", user.id)
    .select()
    .single()
  if (error) {
    throw error
  }
  return data
}

export const softDeleteMerchant = async ({
  merchantId,
}: {
  merchantId: string
}) => {
  const { sb, user } = await getAuthenticatedSupabase()
  const { data, error } = await sb
    .schema(Schemas.V2)
    .from(Tables.Merchants)
    .update({ deleted_at: new Date().toISOString() })
    .eq("merchant_id", merchantId)
    .eq("user_id", user.id)
    .select()
    .single()
  if (error) {
    throw error
  }
  return data
}

export const hardDeleteMerchant = async ({
  merchantId,
}: {
  merchantId: string
}) => {
  const { sb, user } = await getAuthenticatedSupabase()
  const { data, error } = await sb
    .schema(Schemas.V2)
    .from(Tables.Merchants)
    .delete()
    .eq("merchant_id", merchantId)
    .eq("user_id", user.id)
    .select()
    .single()
  if (error) {
    throw error
  }
  return data
}
