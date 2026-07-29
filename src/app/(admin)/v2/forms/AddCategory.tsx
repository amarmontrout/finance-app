import { TransactionTypeValue, V2CategoryType } from "@/api/v2/models"
import { saveCategoryV2, updateCategoryV2 } from "@/api/v2/requests"
import { CheckIcon, CloseIcon } from "@/assets/icons"
import { HookSetter } from "@/types/types"
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
import { CATEGORY_COLORS, DEFAULT_TRANSACTION_TYPES } from "../constants"

const AddCategory = ({
  categoryToEdit,
  setCategoryToEdit,
  refreshCategories,
}: {
  categoryToEdit: V2CategoryType | undefined
  setCategoryToEdit: HookSetter<V2CategoryType | undefined>
  refreshCategories: () => Promise<void>
}) => {
  const [name, setName] = useState<string>("")
  const [defaultTransactionType, setDefaultTransactionType] =
    useState<TransactionTypeValue>("Income")
  const [color, setColor] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (categoryToEdit) {
        await updateCategoryV2({
          rowId: categoryToEdit.category_id,
          body: {
            name: name,
            default_transaction_type: defaultTransactionType,
            color: color,
          },
        })
        setCategoryToEdit(undefined)
      } else {
        await saveCategoryV2({
          body: {
            name: name,
            default_transaction_type: defaultTransactionType,
            color: color,
          },
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setName("")
      setDefaultTransactionType("Income")
      setColor(null)
      refreshCategories()
    }
  }

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name)
      setDefaultTransactionType(categoryToEdit.default_transaction_type)
      setColor(categoryToEdit.color)
    }
  }, [categoryToEdit])

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={1}>
        <TextField
          id={"category-name"}
          size={"small"}
          label={"Category Name"}
          value={name}
          onChange={(e) => setName(e.target.value)}
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
            value={defaultTransactionType}
            onChange={(e) =>
              setDefaultTransactionType(e.target.value as TransactionTypeValue)
            }
          >
            {DEFAULT_TRANSACTION_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack
          direction={"row"}
          gap={1}
          flexWrap={"wrap"}
          justifyContent={"center"}
        >
          <Box
            key={"no-color"}
            onClick={() => setColor(null)}
            sx={{
              width: 32,
              height: 32,
              border: "2px dotted black",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          >
            {color === null && (
              <CloseIcon
                style={{
                  height: "100%",
                  width: "100%",
                  color: "red",
                  padding: 2,
                }}
              />
            )}
          </Box>

          {CATEGORY_COLORS.map((hex) => (
            <Box
              key={hex}
              onClick={() => setColor(hex)}
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: hex,
                cursor: "pointer",
              }}
            >
              {color === hex && (
                <CheckIcon
                  style={{
                    border: "2px solid black",
                    borderRadius: "50%",
                    height: "100%",
                    width: "100%",
                    color: "white",
                    padding: 5,
                  }}
                />
              )}
            </Box>
          ))}
        </Stack>

        <Button
          type={"submit"}
          variant={"contained"}
          sx={{
            color: "#F5F1E8",
            bgcolor: "#102A1B",
          }}
          disabled={name === ""}
        >
          {categoryToEdit ? "Update" : "Add"} Category
        </Button>
      </Stack>
    </form>
  )
}

export default AddCategory
