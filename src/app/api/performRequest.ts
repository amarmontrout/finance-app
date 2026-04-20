import { supabaseBrowser } from "@/utils/supabase/client"
import { PostgrestError } from "@supabase/supabase-js"

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
  column: keyof T
  operator: FilterOperator
  value: T[keyof T] | T[keyof T][]
}

type Response<T> = {
  data: T[] | null
  error: PostgrestError | null
}

const applyFilter = <T>(
  query: any,
  { column, operator, value }: Filter<T>
) => {
  switch (operator) {
    case "eq":
      return query.eq(column as string, value)
    case "neq":
      return query.neq(column as string, value)
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

export const performRequest = async <T>({
  schema,
  table,
  method,
  userId,
  rowId,
  body,
  filters,
}: {
  schema: string
  table: string
  method: Method
  userId: string
  rowId?: number
  body?: Partial<T>
  filters?: Filter<T>[]
}): Promise<Response<T>> => {
  const sb = supabaseBrowser()

  try {
    switch (method) {
      case "POST": {
        const res = await sb
          .schema(schema)
          .from(table)
          .insert([{ ...body, user_id: userId }])
          .select()

        return res
      }

      case "GET": {
        let allData: T[] = []
        let from = 0
        const pageSize = 1000

        while (true) {
          let query = sb
            .schema(schema)
            .from(table)
            .select("*")
            .eq("user_id", userId)
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
          .schema(schema)
          .from(table)
          .update(body)
          .eq("id", rowId)
          .eq("user_id", userId)
          .select()

        return res
      }

      case "DELETE": {
        if (!rowId) throw new Error("rowId required for DELETE")

        const res = await sb
          .schema(schema)
          .from(table)
          .delete()
          .eq("id", rowId)
          .eq("user_id", userId)
          .select()

        return res
      }
    }
  } catch (error: unknown) {
    return {
      data: null,
      error:
        error instanceof Error
          ? ({ message: error.message } as PostgrestError)
          : null,
    }
  }
}