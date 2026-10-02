import { CategoryType } from "@/app/(api)/categories/models"
import { CreateMerchantType, MerchantType } from "@/app/(api)/merchants/models"
import { createMerchant, updateMerchant } from "@/app/(api)/merchants/requests"
import { TEXT_COLOR } from "@/app/data/colors"
import { HookSetter } from "@/app/lib/types"
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
import { AlertToastType } from "../ui/AlertToast"

const createInitialMerchant = (): CreateMerchantType => ({
  name: "",
  default_category_id: null,
})

const MerchantForm = ({
  categories,
  merchantToEdit,
  setMerchantToEdit,
  refreshMerchants,
  setAlertToast,
}: {
  categories: CategoryType[]
  merchantToEdit?: MerchantType | undefined
  setMerchantToEdit?: HookSetter<MerchantType | undefined>
  refreshMerchants: () => Promise<void>
  setAlertToast: HookSetter<AlertToastType | undefined>
}) => {
  const [newMerchant, setNewMerchant] = useState<CreateMerchantType>(
    createInitialMerchant(),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (merchantToEdit) {
        await updateMerchant({
          merchantId: merchantToEdit.merchant_id,
          body: newMerchant,
        })
        setAlertToast({
          open: true,
          onClose: () => {
            setAlertToast(undefined)
          },
          severity: "success",
          message: "Merchant updated successfully!",
        })
        setMerchantToEdit && setMerchantToEdit(undefined)
      } else {
        await createMerchant({
          body: newMerchant,
        })
        setAlertToast({
          open: true,
          onClose: () => {
            setAlertToast(undefined)
          },
          severity: "success",
          message: "Merchant saved successfully!",
        })
      }
      setNewMerchant(createInitialMerchant())
      await refreshMerchants()
    } catch (error) {
      console.log(error)
      setAlertToast({
        open: true,
        onClose: () => {
          setAlertToast(undefined)
        },
        severity: "error",
        message: "Failed to save/update merchant!",
      })
    }
  }

  useEffect(() => {
    if (merchantToEdit) {
      setNewMerchant({ ...merchantToEdit })
    }
  }, [merchantToEdit])

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={1}>
        <TextField
          id={"merchant-name"}
          size={"small"}
          label={"Merchant Name"}
          value={newMerchant.name}
          onChange={(e) =>
            setNewMerchant((prev) => ({
              ...prev,
              name: e.target.value ?? null,
            }))
          }
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
            value={newMerchant.default_category_id ?? ""}
            onChange={(e) =>
              setNewMerchant((prev) => ({
                ...prev,
                default_category_id: e.target.value ?? null,
              }))
            }
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
          sx={{ color: TEXT_COLOR }}
          disabled={newMerchant.name == ""}
        >
          {merchantToEdit ? "Update" : "Add"} Merchant
        </Button>
      </Stack>
    </form>
  )
}

export default MerchantForm
