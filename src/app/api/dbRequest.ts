import { supabaseBrowser } from "@/utils/supabase/client"
import { PostgrestError } from "@supabase/supabase-js"

export const dbRequestBrowser = async <T>({
  schema,
  table,
  method,
  userId,
  rowId,
  body
}: {
  schema: string
  table: string
  method: "POST" | "GET" | "PATCH" | "DELETE"
  userId: string
  rowId?: number
  body?: Partial<T>
}): Promise<{ data: T[] | null; error: PostgrestError | null }> => {

  const sb = supabaseBrowser()

  try {
    switch (method) {
      case "POST":
        return await sb
          .schema(schema)
          .from(table)
          .insert([{ ...body, user_id: userId }])
          .select()

      case "GET": {
        const pageSize = 1000
        let from = 0
        let allData: T[] = []

        while (true) {
          const { data, error } = await sb
            .schema(schema)
            .from(table)
            .select("*")
            .eq("user_id", userId)
            .range(from, from + pageSize - 1)
          if (error) {
            return { data: null, error }
          }
          if (!data || data.length === 0) break
          allData.push(...data)
          if (data.length < pageSize) break
          from += pageSize
        }
        return { data: allData, error: null }
      }

      case "PATCH":
        if (!rowId || !body) {
          throw new Error("PATCH requires rowId and body")
        }

        return await sb
          .schema(schema)
          .from(table)
          .update(body)
          .eq("id", rowId)
          .eq("user_id", userId)
          .select()

      case "DELETE":
        if (!rowId) {
          throw new Error("DELETE requires rowId")
        }

        return await sb
          .schema(schema)
          .from(table)
          .delete()
          .eq("id", rowId)
          .eq("user_id", userId)
          .select()
    }
  } catch (error: unknown) {
    return {
      data: null,
      error: error instanceof Error
        ? { message: error.message } as PostgrestError
        : null
    }
  }
}