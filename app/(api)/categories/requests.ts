import { getAuthenticatedSupabase } from "../getAuthenticatedSupabase"
import { Schemas, Tables } from "../supabase/models"
import { CategoryType, CreateCategoryType } from "./models"

export const createCategory = async ({
  body,
}: {
  body: CreateCategoryType
}) => {
  const { sb, user } = await getAuthenticatedSupabase()
  const { data, error } = await sb
    .schema(Schemas.V2)
    .from(Tables.Categories)
    .insert({ ...body, user_id: user.id })
    .select()
    .single()
  if (error) {
    throw error
  }
  return data
}

export const getAllCategories = async () => {
  const { sb, user } = await getAuthenticatedSupabase()
  const { data, error } = await sb
    .schema(Schemas.V2)
    .from(Tables.Categories)
    .select("*")
    .eq("user_id", user.id)
    .is("deleted_at", null)
  if (error) {
    throw error
  }
  return data
}

export const updateCategory = async ({
  categoryId,
  body,
}: {
  categoryId: string
  body: Partial<CategoryType>
}) => {
  const { sb, user } = await getAuthenticatedSupabase()
  const { data, error } = await sb
    .schema(Schemas.V2)
    .from(Tables.Categories)
    .update(body)
    .eq("category_id", categoryId)
    .eq("user_id", user.id)
    .select()
    .single()
  if (error) {
    throw error
  }
  return data
}

export const softDeleteCategory = async ({
  categoryId,
}: {
  categoryId: string
}) => {
  const { sb, user } = await getAuthenticatedSupabase()
  const { data, error } = await sb
    .schema(Schemas.V2)
    .from(Tables.Categories)
    .update({ deleted_at: new Date().toISOString() })
    .eq("category_id", categoryId)
    .eq("user_id", user.id)
    .select()
    .single()
  if (error) {
    throw error
  }
  return data
}

export const hardDeleteCategory = async ({
  categoryId,
}: {
  categoryId: string
}) => {
  const { sb, user } = await getAuthenticatedSupabase()
  const { data, error } = await sb
    .schema(Schemas.V2)
    .from(Tables.Categories)
    .delete()
    .eq("category_id", categoryId)
    .eq("user_id", user.id)
    .select()
    .single()
  if (error) {
    throw error
  }
  return data
}
