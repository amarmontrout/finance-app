import { TransactionTypeValue } from "@/api/v2/models"
import { saveCategoryV2 } from "@/api/v2/requests"
import { Stack } from "@mui/material"
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
      <Stack gap={1} border={"1px solid red"}>
        <Stack direction={"row"} gap={1}>
          <label htmlFor="category-name">Category Name</label>
          <input
            id="category-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Groceries"
          />
        </Stack>

        <Stack direction={"row"} gap={1}>
          <label htmlFor="default-transaction-type">
            Default Transaction Type
          </label>
          <select
            id="default-transaction-type"
            value={defaultTransactionType}
            onChange={(e) =>
              setDefaultTransactionType(e.target.value as TransactionTypeValue)
            }
          >
            {DEFAULT_TYPES.map((categoryType) => (
              <option key={categoryType.value} value={categoryType.value}>
                {categoryType.label}
              </option>
            ))}
          </select>
        </Stack>

        <Stack direction={"row"} gap={1}>
          <label htmlFor="color">Color</label>
          <input
            id="color"
            value={color ?? ""}
            onChange={(e) => setColor(e.target.value.toLowerCase())}
            placeholder="e.g. Red"
          />
        </Stack>

        <button type="submit">Add Category</button>
      </Stack>
    </form>
  )
}

export default AddCategory
