import { AccountType } from "@/app/(api)/accounts/models"
import { CategoryType, CreateCategoryType } from "@/app/(api)/categories/models"
import { createCategory, updateCategory } from "@/app/(api)/categories/requests"
import { CATEGORY_COLORS, TEXT_COLOR } from "@/app/data/colors"
import { DEFAULT_TRANSACTION_TYPES } from "@/app/data/constants"
import { HookSetter } from "@/app/lib/types"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import {
  Box,
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

const createInitialCategory = (): CreateCategoryType => ({
  name: "",
  default_transaction_type: "Income",
  default_account_id: null,
  color: null,
})

const CategoryForm = ({
  categoryToEdit,
  setCategoryToEdit,
  refreshCategories,
  accounts,
  setAlertToast,
}: {
  categoryToEdit?: CategoryType | undefined
  setCategoryToEdit?: HookSetter<CategoryType | undefined>
  refreshCategories: () => Promise<void>
  accounts: AccountType[]
  setAlertToast: HookSetter<AlertToastType | undefined>
}) => {
  const [newCategory, setnewCategory] = useState<CreateCategoryType>(
    createInitialCategory(),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (categoryToEdit) {
        await updateCategory({
          categoryId: categoryToEdit.category_id,
          body: newCategory,
        })
        setAlertToast({
          open: true,
          onClose: () => setAlertToast(undefined),
          severity: "success",
          message: "Category updated successfully!",
        })
        setCategoryToEdit && setCategoryToEdit(undefined)
      } else {
        await createCategory({ body: newCategory })
        setAlertToast({
          open: true,
          onClose: () => setAlertToast(undefined),
          severity: "success",
          message: "Category saved successfully!",
        })
      }
      setnewCategory(createInitialCategory())
      await refreshCategories()
    } catch (error) {
      console.log(error)
      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "error",
        message: "Failed to save/update category!",
      })
    }
  }

  useEffect(() => {
    if (categoryToEdit) {
      setnewCategory({ ...categoryToEdit })
    }
  }, [categoryToEdit])

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={1}>
        <TextField
          id={"category-name"}
          size={"small"}
          label={"Category Name"}
          value={newCategory.name}
          onChange={(e) =>
            setnewCategory((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder={"e.g. Groceries"}
          required
        />

        <FormControl size={"small"}>
          <InputLabel id={"default-transaction-type-label"}>
            Default Transaction Type
          </InputLabel>

          <Select
            id={"default-transaction-type"}
            labelId={"default-transaction-type-label"}
            size={"small"}
            label={"Default Transaction Type"}
            value={newCategory.default_transaction_type}
            onChange={(e) =>
              setnewCategory((prev) => ({
                ...prev,
                default_transaction_type: e.target.value,
              }))
            }
          >
            {DEFAULT_TRANSACTION_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size={"small"}>
          <InputLabel id={"default-account-label"}>Default Account</InputLabel>

          <Select
            id={"default-account"}
            size={"small"}
            labelId={"default-account-label"}
            label={"Select Account"}
            value={newCategory.default_account_id ?? ""}
            onChange={(e) =>
              setnewCategory((prev) => ({
                ...prev,
                default_account_id: e.target.value ?? null,
              }))
            }
          >
            {accounts
              .filter((account) => !account.deleted_at)
              .map((account) => (
                <MenuItem key={account.account_id} value={account.account_id}>
                  {account.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <Stack
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 1,
            justifyItems: "center",
          }}
        >
          <Box
            key={"no-color"}
            onClick={() => setnewCategory((prev) => ({ ...prev, color: null }))}
            sx={{
              width: 32,
              height: 32,
              border: "2px dotted white",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          >
            {newCategory.color === null && (
              <CloseIcon
                style={{
                  height: "100%",
                  width: "100%",
                  color: "red",
                  padding: 0.5,
                }}
              />
            )}
          </Box>

          {CATEGORY_COLORS.map((hex) => (
            <Box
              key={hex}
              onClick={() =>
                setnewCategory((prev) => ({ ...prev, color: hex }))
              }
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: hex,
                cursor: "pointer",
              }}
            >
              {newCategory.color === hex && (
                <CheckIcon
                  style={{
                    border: "2px solid white",
                    borderRadius: "50%",
                    height: "100%",
                    width: "100%",
                    color: "white",
                    padding: 0.5,
                  }}
                />
              )}
            </Box>
          ))}
        </Stack>

        <Button
          type={"submit"}
          sx={{ color: TEXT_COLOR }}
          disabled={newCategory.name === ""}
        >
          {categoryToEdit ? "Update" : "Add"} Category
        </Button>
      </Stack>
    </form>
  )
}

export default CategoryForm
