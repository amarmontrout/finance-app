import { BudgetType, CreateBudgetType } from "@/app/(api)/budgets/models"
import { createBudget, updateBudget } from "@/app/(api)/budgets/requests"
import { CategoryType } from "@/app/(api)/categories/models"
import { TEXT_COLOR } from "@/app/data/colors"
import { getISOMonth, getISOMonthWithOffset } from "@/app/lib/functions/getters"
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
import { useEffect, useMemo, useState } from "react"
import { AlertToastType } from "../ui/AlertToast"

const createInitialBudget = (): CreateBudgetType => ({
  category_id: null,
  start_month: getISOMonth(),
  amount: 0,
})

const BudgetForm = ({
  categories,
  budgets,
  budgetToEdit,
  setBudgetToEdit,
  onClose,
  refreshBudgets,
  setAlertToast,
}: {
  categories: CategoryType[]
  budgets: BudgetType[]
  budgetToEdit?: BudgetType | undefined
  setBudgetToEdit?: HookSetter<BudgetType | undefined>
  onClose?: () => void
  refreshBudgets: () => Promise<void>
  setAlertToast: HookSetter<AlertToastType | undefined>
}) => {
  const [newBudget, setNewBudget] = useState<CreateBudgetType>(
    createInitialBudget(),
  )
  const currentMonth = getISOMonth()
  const lastMonth = getISOMonthWithOffset(currentMonth, -1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!budgetToEdit) {
        await createBudget({
          body: {
            category_id: newBudget.category_id,
            start_month: currentMonth,
            amount: newBudget.amount,
          },
        })
        setAlertToast({
          open: true,
          onClose: () => setAlertToast(undefined),
          severity: "success",
          message: "Budget saved successfully!",
        })
      } else {
        const categoryChanged =
          budgetToEdit.category_id !== newBudget.category_id
        const amountChanged = budgetToEdit.amount !== newBudget.amount
        const createdThisMonth = budgetToEdit.start_month === currentMonth

        if (categoryChanged && amountChanged) {
          await createBudget({
            body: {
              category_id: newBudget.category_id,
              start_month: currentMonth,
              amount: newBudget.amount,
            },
          })
          setAlertToast({
            open: true,
            onClose: () => setAlertToast(undefined),
            severity: "success",
            message: "Budget saved successfully!",
          })
        } else if (categoryChanged) {
          await createBudget({
            body: {
              category_id: newBudget.category_id,
              start_month: currentMonth,
              amount: budgetToEdit.amount,
            },
          })
          setAlertToast({
            open: true,
            onClose: () => setAlertToast(undefined),
            severity: "success",
            message: "Budget updated successfully!",
          })
        } else if (amountChanged && createdThisMonth) {
          await updateBudget({
            budgetId: budgetToEdit.budget_id,
            body: { amount: newBudget.amount },
          })
          setAlertToast({
            open: true,
            onClose: () => setAlertToast(undefined),
            severity: "success",
            message: "Budget updated successfully!",
          })
        } else if (amountChanged) {
          await updateBudget({
            budgetId: budgetToEdit.budget_id,
            body: { end_month: lastMonth },
          })
          await createBudget({
            body: {
              category_id: budgetToEdit.category_id,
              start_month: currentMonth,
              amount: newBudget.amount,
            },
          })
          setAlertToast({
            open: true,
            onClose: () => setAlertToast(undefined),
            severity: "success",
            message: "Budget updated successfully!",
          })
        }
      }
      setBudgetToEdit && setBudgetToEdit(undefined)
      setNewBudget(createInitialBudget())
      onClose && onClose()
      await refreshBudgets()
    } catch (error) {
      console.error(error)
      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "error",
        message: "Failed to save/update budget!",
      })
    }
  }

  const availableCategories = useMemo(() => {
    const budgetedCategoryIds = new Set(
      budgets
        .filter(
          (budget) =>
            budget.budget_id !== budgetToEdit?.budget_id &&
            budget.start_month <= currentMonth &&
            (budget.end_month === null || budget.end_month >= currentMonth),
        )
        .map((budget) => budget.category_id),
    )

    return categories.filter(
      (category) =>
        (category.category_id === budgetToEdit?.category_id ||
          !budgetedCategoryIds.has(category.category_id)) &&
        !["Income", "Return"].includes(category.default_transaction_type),
    )
  }, [categories, budgets, budgetToEdit, currentMonth])

  useEffect(() => {
    if (budgetToEdit) {
      setNewBudget({
        category_id: budgetToEdit.category_id,
        start_month: budgetToEdit.start_month,
        amount: budgetToEdit.amount,
      })
    }
  }, [budgetToEdit])

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={1}>
        <FormControl size={"small"}>
          <InputLabel id={"category-label"}>Category</InputLabel>

          <Select
            id={"default-category"}
            labelId={"category-label"}
            label={"Category"}
            size={"small"}
            value={newBudget.category_id ?? ""}
            disabled={!!budgetToEdit}
            onChange={(e) =>
              setNewBudget((prev) => ({
                ...prev,
                category_id: e.target.value ?? null,
              }))
            }
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
          value={String(newBudget.amount)}
          onChange={(e) =>
            setNewBudget((prev) => ({
              ...prev,
              amount: Number(e.target.value),
            }))
          }
          placeholder={"$0"}
          required
        />

        <Button
          type={"submit"}
          sx={{ color: TEXT_COLOR }}
          disabled={
            newBudget.category_id === "" || String(newBudget.amount) === "0"
          }
        >
          {budgetToEdit ? "Update" : "Add"} Budget
        </Button>
      </Stack>
    </form>
  )
}

export default BudgetForm
