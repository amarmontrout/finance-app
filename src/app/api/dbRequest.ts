import { supabaseBrowser } from "@/utils/supabase/client"
import { PostgrestError } from "@supabase/supabase-js"

type Operator =
  | "eq" | "neq"
  | "in"
  | "lt" | "lte" | "gt" | "gte"
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
      let columnKey = column as string
      let filterValue: unknown = value
      if (typeof value === "object" && !Array.isArray(value)) {
        for (const [k, v] of Object.entries(value)) {
          if (v === undefined || v === null) continue
          const path = `${columnKey}->>${k}`
          q = applyOperator(q, path, operator, v)
        }
        continue
      }
      q = applyOperator(q, columnKey, operator, filterValue)
    }
    return q
  }

  const applyOperator = (query: any, column: string, operator: Operator, value: unknown) => {
    switch (operator) {
      case "eq": return query.eq(column, value) //Equal to
      case "neq": return query.neq(column, value) //Not equal to
      case "in": return Array.isArray(value) && value.length > 0 ? query.in(column, value) : query //Multiple options at once
      
      case "lt": return query.lt(column, value) //Less than (numbers)
      case "lte": return query.lte(column, value) //Less than or equal to (numbers)
      case "gt": return query.gt(column, value) //Greater than (numbers)
      case "gte": return query.gte(column, value) //Greater than or equal to (numbers)
      case "like": return query.like(column, value) //Partial string match
      case "ilike": return query.ilike(column, value) //Case insensitive match
      default: return query
    }
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