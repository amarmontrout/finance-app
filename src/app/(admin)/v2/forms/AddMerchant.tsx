import { V2CategoryType, V2MerchantType } from "@/api/v2/models"
import { saveMerchantsV2, updateMerchantV2 } from "@/api/v2/requests"
import { HookSetter } from "@/types/types"
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material"
import { useEffect, useState } from "react"

const AddMerchant = ({
  categories,
  merchantToEdit,
  setMerchantToEdit,
  refreshMerchants,
}: {
  categories: V2CategoryType[]
  merchantToEdit: V2MerchantType | undefined
  setMerchantToEdit: HookSetter<V2MerchantType | undefined>
  refreshMerchants: () => Promise<void>
}) => {
  const [name, setName] = useState<string>("")
  const [defaultCategoryId, setDefaultCategoryId] = useState<string | null>(
    null,
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (merchantToEdit) {
        await updateMerchantV2({
          rowId: merchantToEdit.merchant_id,
          body: {
            name: name,
            default_category_id: defaultCategoryId,
          },
        })
        setMerchantToEdit(undefined)
      } else {
        await saveMerchantsV2({
          body: {
            name: name,
            default_category_id: defaultCategoryId,
          },
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setName("")
      setDefaultCategoryId(null)
      refreshMerchants()
    }
  }

  useEffect(() => {
    if (merchantToEdit) {
      setName(merchantToEdit.name)
      setDefaultCategoryId(merchantToEdit.default_category_id)
    }
  }, [merchantToEdit])

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

        <Button
          type={"submit"}
          variant={"contained"}
          sx={{
            color: "#F5F1E8",
            bgcolor: "#102A1B",
          }}
          disabled={name == ""}
        >
          {merchantToEdit ? "Update" : "Add"} Merchant
        </Button>
      </Stack>
    </form>
  )
}

export default AddMerchant
