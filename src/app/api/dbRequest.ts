import { supabaseBrowser } from "@/utils/supabase/client"
import { PostgrestResponse } from "@supabase/supabase-js"

export const dbRequestBrowser = async <T>({
  schema,
  table,
  method,
  userId,
  rowId,
  body,
  onSuccess,
  onError
}: {
  schema: string
  table: string
  method: "POST" | "GET" | "PATCH" | "DELETE"
  userId: string
  rowId?: number
  body?: object
  onSuccess: (data: T[] | null) => void
  onError: (error: PostgrestResponse<T>["error"]) => void
}) => {
  const sb = supabaseBrowser()
  let result: PostgrestResponse<T>

  switch (method) {
    case "POST":
      result = await sb
        .schema(schema)
        .from(table)
        .insert([{...body, user_id: userId}])
        .select()
      break
    case "GET":
      result = await sb
        .schema(schema)
        .from(table)
        .select("*")
        .eq("user_id", userId)
      break
    case "PATCH":
      result = await sb
        .schema(schema)
        .from(table)
        .update(body!)
        .eq("id", rowId!)
        .eq("user_id", userId)
        .select()
      break
    case "DELETE":
      result = await sb
        .schema(schema)
        .from(table)
        .delete()
        .eq("id", rowId)
        .eq("user_id", userId)
        .select()
      break
  }

  if (result.error) {
    onError(result.error)
  } else {
    onSuccess(result.data)
  }
}