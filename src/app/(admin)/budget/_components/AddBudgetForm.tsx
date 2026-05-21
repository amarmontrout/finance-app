import { BudgetType, ChoiceType } from "@/api/choices/models"
import {
  deleteBudgetCategory,
  saveBudgetCategory,
  saveExpenseCategory,
} from "@/api/choices/requests"
import { neutralColor, positiveColor } from "@/global/colors"
import ListItemSwipe from "@/global/components/ListItemSwipe"
import MoneyInput from "@/global/components/MoneyInput"
import { numberToString } from "@/global/formattingFunctions"
import { makeId } from "@/global/infoFunctions"
import { useUser } from "@/hooks/use-user"
import { AlertToastType, HookSetter } from "@/types/types"
import {
  Button,
  Divider,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material"
import { useTheme } from "next-themes"
import { ChangeEvent, useState } from "react"

const AddBudgetForm = ({
  confirmSelection,
  setConfirmSelection,
  budgetCategories,
  loadCategories,
  expenseCategories,
  setAlertToast,
}: {
  confirmSelection: BudgetType | null
  setConfirmSelection: HookSetter<BudgetType | null>
  budgetCategories: BudgetType[]
  loadCategories: () => Promise<void>
  expenseCategories: ChoiceType[]
  setAlertToast: HookSetter<AlertToastType | undefined>
}) => {
  const user = useUser()
  const { theme: currentTheme } = useTheme()

  const createBudgetInit = (): BudgetType => ({
    id: makeId(),
    category: "",
    amount: 0,
  })

  const [budgetCategory, setBudgetCategory] =
    useState<BudgetType>(createBudgetInit())
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const budgetTotal = budgetCategories.reduce((sum, c) => sum + c.amount, 0)
  const categoryExists = budgetCategories.some(
    (c) => c.category.toLowerCase() === budgetCategory.category.toLowerCase(),
  )
  const borderColor = currentTheme === "light" ? "#4B5563" : "#9CA3AF"

  const syncBudgetToExpense = async (
    budgetCategory: BudgetType,
    userId: string,
  ) => {
    const exists = expenseCategories.some(
      (c) => c.name === budgetCategory.category,
    )

    if (!exists) {
      await saveExpenseCategory({
        userId: userId,
        body: {
          id: makeId(),
          name: budgetCategory.category,
        },
      })
      await loadCategories()
    }
  }

  const handleCategory = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setBudgetCategory((prev) => ({
      ...prev,
      category: e.target.value,
    }))
  }

  const resetFormData = () => {
    setBudgetCategory(createBudgetInit())
  }

  const save = async () => {
    if (!user) return
    setIsLoading(true)
    await saveBudgetCategory({
      userId: user.id,
      body: budgetCategory,
    })
    await syncBudgetToExpense(budgetCategory, user.id)
    setIsLoading(false)
    loadCategories()
    resetFormData()
  }

  const showToast = (severity: "success" | "error", message: string) =>
    setAlertToast({
      open: true,
      severity,
      message,
      onClose: () => setAlertToast(undefined),
    })

  const handleDeleteSelection = async (rowId: number) => {
    if (!user || !rowId) return

    try {
      await deleteBudgetCategory({
        userId: user.id,
        rowId: rowId,
      })
      showToast("success", "Budget deleted successfully!")
    } catch {
      showToast("error", "Budget could not be deleted.")
    } finally {
      setConfirmSelection(null)
      loadCategories()
    }
  }

  return (
    <Stack direction={"column"} spacing={1}>
      <Stack spacing={2}>
        <Stack direction={"column"} spacing={1}>
          <MoneyInput
            value={budgetCategory.amount}
            setValue={setBudgetCategory}
          />

          <OutlinedInput
            size={"small"}
            placeholder={"Enter Category"}
            value={budgetCategory.category}
            name={"category"}
            onChange={handleCategory}
            sx={{
              color: borderColor,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor,
              },
            }}
          />

          <Button
            variant={"contained"}
            disabled={
              budgetCategory.category === "" ||
              budgetCategory.amount === 0 ||
              categoryExists
            }
            onClick={save}
            sx={{ backgroundColor: positiveColor.color }}
            loading={isLoading}
          >
            {"Add"}
          </Button>
        </Stack>

        <Stack
          divider={
            <Divider
              orientation={"horizontal"}
              sx={{ borderColor: neutralColor.bg }}
            />
          }
        >
          {budgetCategories
            .slice()
            .sort((a, b) => a.category.localeCompare(b.category))
            .map((entry) => {
              return (
                <ListItemSwipe
                  key={entry.id}
                  mainTitle={entry.category}
                  secondaryTitle={""}
                  amount={`$${numberToString(entry.amount)}`}
                  amountColor={"inherit"}
                  buttonCondition={confirmSelection?.id === entry.id}
                  onDelete={() => handleDeleteSelection(entry.id)}
                  onSetDelete={() => setConfirmSelection(entry)}
                  onCancelDelete={() => setConfirmSelection(null)}
                  onEdit={() => {}}
                  noEdit={true}
                />
              )
            })}
        </Stack>
      </Stack>

      <Typography sx={{ textAlign: "right" }}>
        {`$${numberToString(budgetTotal)} Total`}
      </Typography>
    </Stack>
  )
}

export default AddBudgetForm
