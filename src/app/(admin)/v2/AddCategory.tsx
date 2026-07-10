import { TransactionTypeValue } from "@/api/v2/models"
import { saveCategoryV2 } from "@/api/v2/requests"
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

const DEFAULT_TYPES = [
  { value: "Income", label: "Income" },
  { value: "Expense", label: "Expense" },
  { value: "Refund", label: "Refund" },
]

const AddCategory = () => {
  const [name, setName] = useState<string>("")
  const [defaultTransactionType, setDefaultTransactionType] =
    useState<TransactionTypeValue>("Income")
  const [color, setColor] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) return

    await saveCategoryV2({
      body: {
        name: name,
        default_transaction_type: defaultTransactionType,
        color: color,
      },
    })

    setName("")
    setDefaultTransactionType("Income")
    setColor(null)
  }

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
            {DEFAULT_TYPES.map((categoryType) => (
              <MenuItem key={categoryType.value} value={categoryType.value}>
                {categoryType.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          id={"color"}
          size={"small"}
          label={"Color"}
          value={color ?? ""}
          onChange={(e) => setColor(e.target.value.toLowerCase())}
          placeholder={"e.g. Red"}
        />

        <Button type={"submit"} variant={"contained"} disabled={name === ""}>
          Add Category
        </Button>
      </Stack>
    </form>
  )
}

export default AddCategory
