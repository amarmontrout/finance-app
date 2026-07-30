import { ChoiceType } from "@/api/choices/models"
import {
  deleteExpenseCategory,
  saveExpenseCategory,
} from "@/api/choices/requests"
import { neutralColor } from "@/global/colors"
import ListItemSwipe from "@/global/components/ListItemSwipe"
import { makeId } from "@/global/infoFunctions"
import { useUser } from "@/hooks/use-user"
import { AlertToastType, HookSetter } from "@/types/types"
import { Divider, Stack } from "@mui/material"
import { useTheme } from "next-themes"
import { ChangeEvent, useState } from "react"
import SimpleForm from "./SimpleForm"

const AddExpenseCategory = ({
  setCategoryDialogOpen,
  setChoice,
  expenseCategories,
  loadCategories,
  syncExpenseToBudget,
  setAlertToast,
}: {
  setCategoryDialogOpen: HookSetter<boolean>
  setChoice: HookSetter<ChoiceType | null>
  expenseCategories: ChoiceType[]
  loadCategories: () => Promise<void>
  syncExpenseToBudget: (expense: string, userId: string) => Promise<void>
  setAlertToast: HookSetter<AlertToastType | undefined>
}) => {
  const user = useUser()
  const { theme: currentTheme } = useTheme()

  const [expenseCategoriesInput, setExpenseCategoriesInput] =
    useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [confirmSelection, setConfirmSelection] = useState<number | null>(null)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = e.target
    setExpenseCategoriesInput(value)
  }

  const handleDeleteEntry = async (id: number) => {
    if (!user || !id) return
    try {
      await deleteExpenseCategory({
        userId: user.id,
        rowId: id,
      })
      setAlertToast({
        open: true,
        onClose: () => {
          setAlertToast(undefined)
        },
        severity: "success",
        message: "Year deleted successfully!",
      })
    } catch (error) {
      console.error(error)
      setAlertToast({
        open: true,
        onClose: () => {
          setAlertToast(undefined)
        },
        severity: "error",
        message: "Year could not be deleted.",
      })
    } finally {
      await loadCategories()
    }
  }

  const save = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      await saveExpenseCategory({
        userId: user.id,
        body: {
          id: makeId(),
          name: expenseCategoriesInput,
        },
      })
      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "success",
        message: "Expense category saved successfully!",
      })
    } catch (error) {
      console.error(error)
      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "error",
        message: "Expense category could not be saved.",
      })
    } finally {
      await syncExpenseToBudget(expenseCategoriesInput, user.id)
      await loadCategories()
      setExpenseCategoriesInput("")
      setIsLoading(false)
    }
  }

  return (
    <Stack spacing={1}>
      <SimpleForm
        placeholder={"Add An Expense Category"}
        value={expenseCategoriesInput}
        onChange={handleChange}
        onSubmit={save}
        isLoading={isLoading}
      />

      <Stack
        divider={
          <Divider
            orientation={"horizontal"}
            sx={{ borderColor: neutralColor.bg }}
          />
        }
      >
        {expenseCategories.map((entry, index) => {
          return (
            <ListItemSwipe
              key={entry.id}
              mainTitle={entry.name}
              secondaryTitle={""}
              amount={""}
              amountColor={"inherit"}
              buttonCondition={confirmSelection === entry.id}
              onDelete={async () => {
                handleDeleteEntry(entry.id)
              }}
              onSetDelete={() => {
                setConfirmSelection(entry.id)
              }}
              onCancelDelete={() => {
                setConfirmSelection(null)
              }}
              onEdit={() => {
                if (setCategoryDialogOpen && setChoice) {
                  setCategoryDialogOpen(true)
                  setChoice(entry)
                }
              }}
              noEdit={true} // Remove if I can find a reason to label expenses as recurring
            />
          )
        })}
      </Stack>
    </Stack>
  )
}

export default AddExpenseCategory
