import { supabaseBrowser } from "@/utils/supabase/client"
import { PostgrestError } from "@supabase/supabase-js"

type Operator =
  | "eq" | "neq"
  | "lt" | "lte" | "gt" | "gte"
  | "in"
  | "like" | "ilike"

export type Filter<T> = {
  column: keyof T
  operator?: Operator
  value: unknown
}

type DbResponse<T> = {
  data: T[] | null
  error: PostgrestError | null
}

export const dbRequestBrowser = async <T>({
  schema,
  table,
  method,
  userId,
  rowId,
  body,
  filters = [],
}: {
  schema: string
  table: string
  method: "POST" | "GET" | "PATCH" | "DELETE"
  userId: string
  rowId?: number
  body?: Partial<T>
  filters?: Filter<T>[]
}): Promise<DbResponse<T>> => {

  const sb = supabaseBrowser()

  const applyFilters = (query: any) => {
    let q = query.eq("user_id", userId)

    for (const { column, operator = "eq", value } of filters) {
      if (value === undefined || value === null) continue

      switch (operator) {
        case "eq": q = q.eq(column as string, value); break
        case "neq": q = q.neq(column as string, value); break
        case "lt": q = q.lt(column as string, value); break
        case "lte": q = q.lte(column as string, value); break
        case "gt": q = q.gt(column as string, value); break
        case "gte": q = q.gte(column as string, value); break
        case "in":
          if (Array.isArray(value) && value.length > 0) {
            q = q.in(column as string, value)
          }
          break
        case "like": q = q.like(column as string, value); break
        case "ilike": q = q.ilike(column as string, value); break
      }
    }

    return q
  }

  try {
    switch (method) {
      case "POST": {
        const { data, error } = await sb
          .schema(schema)
          .from(table)
          .insert([{ ...body, user_id: userId }])
          .select()

        return { data, error }
      }

      case "GET": {
        const pageSize = 1000
        let from = 0
        let allData: T[] = []

        while (true) {
          let query = sb
            .schema(schema)
            .from(table)
            .select("*")
            .range(from, from + pageSize - 1)

          query = applyFilters(query)

          const { data, error } = await query

          if (error) return { data: null, error }
          if (!data?.length) break

          allData.push(...data)

          if (data.length < pageSize) break
          from += pageSize
        }

        return { data: allData, error: null }
      }

      case "PATCH": {
        if (!rowId || !body) {
          throw new Error("PATCH requires rowId and body")
        }

        const { data, error } = await sb
          .schema(schema)
          .from(table)
          .update(body)
          .eq("id", rowId)
          .eq("user_id", userId)
          .select()

        if (!error && (!data || data.length === 0)) {
          throw new Error("Update failed or unauthorized")
        }

        return { data, error }
      }

      case "DELETE": {
        if (!rowId) {
          throw new Error("DELETE requires rowId")
        }

        const { data, error } = await sb
          .schema(schema)
          .from(table)
          .delete()
          .eq("id", rowId)
          .eq("user_id", userId)
          .select()

        if (!error && (!data || data.length === 0)) {
          throw new Error("Delete failed or unauthorized")
        }

        return { data, error }
      }
    }
  } catch (error: unknown) {
    return {
      data: null,
      error: error instanceof Error
        ? ({ message: error.message } as PostgrestError)
        : null,
    }
  }
}