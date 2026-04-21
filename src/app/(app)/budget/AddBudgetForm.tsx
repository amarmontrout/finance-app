import { positiveColor } from "@/globals/colors"
import {
  Box,
  Button,
  Collapse,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material"
import { useTheme } from "next-themes"
import { ChangeEvent, RefObject, useState } from "react"
import MoneyInput from "@/components/MoneyInput"
import {
  AlertToastType,
  BudgetType,
  ChoiceType,
  HookSetter,
} from "@/utils/type"
import { formattedStringNumber, makeId } from "@/utils/helperFunctions"
import {
  deleteBudgetCategory,
  saveBudgetCategory,
  saveExpenseCategory,
} from "@/app/api/Choices/requests"
import { useUser } from "@/hooks/useUser"
import { TransitionGroup } from "react-transition-group"
import ListItemSwipe from "@/components/ListItemSwipe"

const AddBudgetForm = ({
  confirmSelection,
  setConfirmSelection,
  setBudgetEditDialogOpen,
  setConfirmEdit,
  budgetCategories,
  loadCategories,
  expenseCategories,
  inputRef,
  setAlertToast,
}: {
  confirmSelection: BudgetType | null
  setConfirmSelection: HookSetter<BudgetType | null>
  setBudgetEditDialogOpen: HookSetter<boolean>
  setConfirmEdit: HookSetter<BudgetType | null>
  budgetCategories: BudgetType[]
  loadCategories: () => Promise<void>
  expenseCategories: ChoiceType[]
  inputRef: RefObject<HTMLInputElement | null>
  setAlertToast: HookSetter<AlertToastType | undefined>
}) => {
  const { theme: currentTheme } = useTheme()
  const user = useUser()

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
    <Stack direction={"column"} spacing={3} marginTop={1}>
      <Stack spacing={1}>
        <Stack direction={"column"} spacing={1}>
          <MoneyInput
            value={budgetCategory.amount}
            setValue={setBudgetCategory}
          />

          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <OutlinedInput
              className="w-full h-full"
              label={"Category"}
              value={budgetCategory.category}
              name={"category"}
              onChange={handleCategory}
            />
          </FormControl>

          <Button
            variant={"contained"}
            disabled={
              budgetCategory.category === "" ||
              budgetCategory.amount === 0 ||
              categoryExists
            }
            onClick={save}
            sx={{
              backgroundColor: positiveColor.color,
            }}
            loading={isLoading}
          >
            {"Add"}
          </Button>
        </Stack>

        <hr style={{ width: "100%", marginTop: "10px" }} />

        <Stack spacing={1.5} overflow={"auto"}>
          <TransitionGroup>
            {budgetCategories
              .slice()
              .sort((a, b) => a.category.localeCompare(b.category))
              .map((entry, index) => {
                const isLast = index === budgetCategories.length - 1
                return (
                  <Collapse key={entry.id}>
                    <Box mb={isLast ? 0 : 1}>
                      <ListItemSwipe
                        mainTitle={entry.category}
                        secondaryTitle={""}
                        amount={`$${formattedStringNumber(entry.amount)}`}
                        amountColor={"inherit"}
                        buttonCondition={confirmSelection?.id === entry.id}
                        onDelete={() => handleDeleteSelection(entry.id)}
                        onSetDelete={() => setConfirmSelection(entry)}
                        onCancelDelete={() => setConfirmSelection(null)}
                        onEdit={() => {
                          if (setBudgetEditDialogOpen && setConfirmEdit) {
                            setBudgetEditDialogOpen(true)
                            setConfirmEdit(entry)
                            setTimeout(() => {
                              inputRef.current?.focus()
                            }, 50)
                          }
                        }}
                        currentTheme={currentTheme}
                      />
                    </Box>
                  </Collapse>
                )
              })}
          </TransitionGroup>
        </Stack>
      </Stack>

      <Typography textAlign={"right"}>
        {`$${formattedStringNumber(budgetTotal)} Total`}
      </Typography>
    </Stack>
  )
}

export default AddBudgetForm
