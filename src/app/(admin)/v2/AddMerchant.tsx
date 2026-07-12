import { V2CategoryType } from "@/api/v2/models"
import { saveMerchantsV2 } from "@/api/v2/requests"
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material"
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
      <Stack gap={1}>
        <TextField
          id={"merchant-name"}
          size={"small"}
          label={"Merchant Name"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={"e.g. Walmart"}
          required
        />

        <FormControl size={"small"}>
          <InputLabel id={"default-category-label"}>
            Default Category
          </InputLabel>

          <Select
            id={"default-category"}
            labelId={"default-category-label"}
            label={"Default Category"}
            size={"small"}
            value={defaultCategoryId ?? ""}
            onChange={(e) => setDefaultCategoryId(e.target.value || null)}
          >
            <MenuItem value="">None</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.category_id} value={category.category_id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type={"submit"} variant={"contained"} disabled={name == ""}>
          Add Merchant
        </Button>
      </Stack>
    </form>
  )
}

export default AddMerchant
