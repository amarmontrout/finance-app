import { V2CategoryType } from "@/api/v2/models"
import { saveMerchantsV2 } from "@/api/v2/requests"
import { Stack } from "@mui/material"
import { useState } from "react"

const AddMerchant = ({ categories }: { categories: V2CategoryType[] }) => {
  const [name, setName] = useState<string>("")
  const [defaultCategoryId, setDefaultCategoryId] = useState<string | null>(
    null,
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const merchantName = name.trim()
    if (!merchantName) return
    await saveMerchantsV2({
      body: {
        name: merchantName,
        default_category_id: defaultCategoryId,
      },
    })

    setName("")
    setDefaultCategoryId(null)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={1} border={"1px solid red"}>
        <Stack direction={"row"} gap={1}>
          <label htmlFor="merchant-name">Merchant Name</label>
          <input
            id="merchant-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Walmart"
          />
        </Stack>

        {categories.length !== 0 && (
          <Stack direction={"row"} gap={1}>
            <label htmlFor="default-category">Default Category</label>
            <select
              id="default-category"
              value={defaultCategoryId ?? ""}
              onChange={(e) => setDefaultCategoryId(e.target.value || null)}
            >
              <option value="">Select category</option>

              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Stack>
        )}

        <button type="submit">Add Merchant</button>
      </Stack>
    </form>
  )
}

export default AddMerchant
