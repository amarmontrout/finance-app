import {
  deleteExpenseCategory,
  saveExpenseCategory,
} from "@/app/api/Choices/requests"
import ListItemSwipe from "@/components/ListItemSwipe"
import ShowCaseCard from "@/components/ShowCaseCard"
import SimpleForm from "@/components/SimpleForm"
import { useUser } from "@/hooks/useUser"
import { makeId } from "@/utils/helperFunctions"
import { AlertToastType, ChoiceType, HookSetter } from "@/utils/type"
import { Box, Collapse, Stack } from "@mui/material"
import { useTheme } from "next-themes"
import { ChangeEvent, useState } from "react"
import { TransitionGroup } from "react-transition-group"

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
    <ShowCaseCard title={""}>
      <Stack height={"406px"} spacing={1}>
        <SimpleForm
          label={"Add An Expense Category"}
          value={expenseCategoriesInput}
          onChange={handleChange}
          onSubmit={save}
          isLoading={isLoading}
        />

        <hr style={{ width: "100%" }} />

        <Stack spacing={1.5} overflow={"auto"}>
          <TransitionGroup>
            {expenseCategories.map((entry, index) => {
              const isLast = index === expenseCategories.length - 1
              return (
                <Collapse key={entry.id}>
                  <Box mb={isLast ? 0 : 1}>
                    <ListItemSwipe
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
                      currentTheme={currentTheme}
                      noEdit={true} // Remove if I can find a reason to label expenses as recurring
                    />
                  </Box>
                </Collapse>
              )
            })}
          </TransitionGroup>
        </Stack>
      </Stack>
    </ShowCaseCard>
  )
}

export default AddExpenseCategory
