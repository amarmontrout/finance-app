import { getAuthenticatedSupabase } from "../getAuthenticatedSupabase"
import { Schemas, Tables } from "../supabase/models"
import { BudgetType, CreateBudgetType } from "./models"

export const createBudget = async ({ body }: { body: CreateBudgetType }) => {
  const { sb, user } = await getAuthenticatedSupabase()
  const { data, error } = await sb
    .schema(Schemas.V2)
    .from(Tables.Budgets)
    .insert({ ...body, user_id: user.id })
    .select()
    .single()
  if (error) {
    throw error
  }
  return data
}

export const getAllBudgets = async () => {
  const { sb, user } = await getAuthenticatedSupabase()
  const { data, error } = await sb
    .schema(Schemas.V2)
    .from(Tables.Budgets)
    .select(
      `
      *,
      category:categories (
        name
      )
    `,
    )
    .eq("user_id", user.id)
    .is("deleted_at", null)
  if (error) {
    throw error
  }
  return data
}

export const updateBudget = async ({
  budgetId,
  body,
}: {
  budgetId: string
  body: Partial<BudgetType>
}) => {
  const { sb, user } = await getAuthenticatedSupabase()
  const { data, error } = await sb
    .schema(Schemas.V2)
    .from(Tables.Budgets)
    .update(body)
    .eq("budget_id", budgetId)
    .eq("user_id", user.id)
    .select()
    .single()
  if (error) {
    throw error
  }
  return data
}

export const hardDeleteBudget = async ({
  categoryId,
}: {
  categoryId: string
}) => {
  const { sb, user } = await getAuthenticatedSupabase()
  const { data, error } = await sb
    .schema(Schemas.V2)
    .from(Tables.Budgets)
    .delete()
    .eq("category_id", categoryId)
    .eq("user_id", user.id)
    .select()
  if (error) {
    throw error
  }
  return data
}
