import { supabaseBrowser } from "@/utils/supabase/client"
import { 
  BudgetEntryTypeV2, 
  BudgetTypeV2, 
  ChoiceTypeV2, 
  TransactionTypeV2 
} from "@/utils/type"
import { PostgrestResponse } from "@supabase/supabase-js"

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
  body?: TransactionTypeV2 | BudgetEntryTypeV2 | BudgetTypeV2 | ChoiceTypeV2
}): Promise<{ data: T[] | null; error: PostgrestResponse<T>["error"] }> => {
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

  return {
    data: result.data,
    error: result.error
  }
}