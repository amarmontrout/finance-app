import { V2CategoryType, V2HydratedBudgetType } from "@/api/v2/models"
import { saveBudgetV2, updateBudgetV2 } from "@/api/v2/requests"
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
import { useEffect, useMemo, useState } from "react"
import { getToday } from "../utils"

const AddBudget = ({
  categories,
  budgets,
  budgetToEdit,
  setBudgetToEdit,
}: {
  categories: V2CategoryType[]
  budgets: V2HydratedBudgetType[]
  budgetToEdit: V2HydratedBudgetType | undefined
  setBudgetToEdit: HookSetter<V2HydratedBudgetType | undefined>
}) => {
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [amount, setAmount] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (categoryId === null) {
      return
    }

    try {
      if (budgetToEdit) {
        await updateBudgetV2({
          rowId: budgetToEdit.budget_id,
          body: {
            category_id: categoryId,
            start_date: getToday(),
            amount: Number(amount),
          },
        })
        setBudgetToEdit(undefined)
      } else {
        await saveBudgetV2({
          body: {
            category_id: categoryId,
            start_date: getToday(),
            amount: Number(amount),
          },
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setCategoryId(null)
      setAmount("")
    }
  }

  const availableCategories = useMemo(() => {
    const budgetedCategoryIds = new Set(
      budgets
        .filter((budget) => budget.budget_id !== budgetToEdit?.budget_id)
        .map((budget) => budget.category_id),
    )

    return categories.filter(
      (category) =>
        !budgetedCategoryIds.has(category.category_id) &&
        !["Income", "Refund", "Return"].includes(
          category.default_transaction_type,
        ),
    )
  }, [categories, budgets, budgetToEdit])

  useEffect(() => {
    if (budgetToEdit) {
      setCategoryId(budgetToEdit.category_id)
      setAmount(String(budgetToEdit.amount))
    }
  }, [budgetToEdit])

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={1}>
        <FormControl size={"small"}>
          <InputLabel id={"category-label"}>Category</InputLabel>

          <Select
            id={"default-category"}
            labelId={"category-label"}
            label={"Category"}
            size={"small"}
            value={categoryId ?? ""}
            onChange={(e) => setCategoryId(e.target.value || "")}
            disabled={availableCategories.length === 0}
            required
          >
            {availableCategories.map((category) => (
              <MenuItem key={category.category_id} value={category.category_id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          id={"budget-amount"}
          label={"Amount"}
          size={"small"}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={"$0"}
          disabled={availableCategories.length === 0}
          required
        />

        <Button
          type={"submit"}
          variant={"contained"}
          disabled={categoryId === null || amount === ""}
        >
          {budgetToEdit ? "Update" : "Add"} Budget
        </Button>
      </Stack>
    </form>
  )
}

export default AddBudget
