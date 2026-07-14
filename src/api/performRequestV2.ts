import { supabaseBrowser } from "@/supabase/client"
import { PostgrestError } from "@supabase/supabase-js"
import { Schemas, Tables } from "./v2/models"

type Method = "POST" | "GET" | "PATCH" | "DELETE"

type FilterOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "like"
  | "ilike"
  | "in"

export type Filter<T> = {
  column: keyof T | string
  operator: FilterOperator
  value: T[keyof T] | T[keyof T][]
}

type Response<T> = {
  data: T[] | null
  error: Error | PostgrestError | null
}

const ID_KEYS: Record<Tables, string> = {
  [Tables.Accounts]: "account_id",
  [Tables.Budgets]: "budget_id",
  [Tables.Categories]: "category_id",
  [Tables.Merchants]: "merchant_id",
  [Tables.Transactions]: "transaction_id",
}

const applyFilter = <T>(query: any, { column, operator, value }: Filter<T>) => {
  switch (operator) {
    case "eq":
      return value === null
        ? query.is(column as string, null)
        : query.eq(column as string, value)
    case "neq":
      return value === null
        ? query.not(column as string, "is", null)
        : query.neq(column as string, value)
    case "gt":
      return query.gt(column as string, value)
    case "gte":
      return query.gte(column as string, value)
    case "lt":
      return query.lt(column as string, value)
    case "lte":
      return query.lte(column as string, value)
    case "like":
      return query.like(column as string, value)
    case "ilike":
      return query.ilike(column as string, value)
    case "in":
      if (!Array.isArray(value)) {
        throw new Error('"in" operator requires an array value')
      }
      return query.in(column as string, value)
    default:
      return query
  }
}

export const performRequestV2 = async <T>({
  table,
  method,
  rowId,
  body,
  filters,
}: {
  table: Tables
  method: Method
  rowId?: string
  body?: Partial<T>
  filters?: Filter<T>[]
}): Promise<Response<T>> => {
  const sb = supabaseBrowser()
  const {
    data: { user },
  } = await sb.auth.getUser()
  if (!user) throw new Error("Not Authenticated")
  const idColumn = ID_KEYS[table]

  try {
    switch (method) {
      case "POST": {
        const res = await sb
          .schema(Schemas.V2)
          .from(table)
          .insert([{ ...body, user_id: user.id }])
          .select()

        return res
      }

      case "GET": {
        let allData: T[] = []
        let from = 0
        const pageSize = 1000

        while (true) {
          let query = sb
            .schema(Schemas.V2)
            .from(table)
            .select("*")
            .eq("user_id", user.id)
            .range(from, from + pageSize - 1)

          if (filters?.length) {
            for (const filter of filters) {
              query = applyFilter(query, filter)
            }
          }

          const { data, error } = await query

          if (error) return { data: null, error }
          if (!data || data.length === 0) break
          allData.push(...data)
          if (data.length < pageSize) break
          from += pageSize
        }

        return { data: allData, error: null }
      }

      case "PATCH": {
        if (!rowId) throw new Error("rowId required for PATCH")

        const res = await sb
          .schema(Schemas.V2)
          .from(table)
          .update(body)
          .eq(idColumn, rowId)
          .eq("user_id", user.id)
          .select()

        return res
      }

      case "DELETE": {
        if (!rowId) throw new Error("rowId required for DELETE")

        const res = await sb
          .schema(Schemas.V2)
          .from(table)
          .delete()
          .eq(idColumn, rowId)
          .eq("user_id", user.id)
          .select()

        return res
      }
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : null,
    }
  }
}
