import ShowCaseCard from "@/components/ShowCaseCard"
import { accentColorSecondary, darkMode, lightMode } from "@/globals/colors"
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
import { ChangeEvent, useState } from "react"
import MoneyInput from "@/components/MoneyInput"
import { BudgetType, HookSetter } from "@/utils/type"
import { formattedStringNumber, makeId } from "@/utils/helperFunctions"
import {
  deleteBudgetCategory,
  saveBudgetCategory,
} from "@/app/api/Choices/requests"
import { useUser } from "@/hooks/useUser"
import { TransitionGroup } from "react-transition-group"
import ListItemSwipe from "@/components/ListItemSwipe"

const AddBudget = ({
  confirmSelection,
  setConfirmSelection,
  setBudgetEditDialogOpen,
  setConfirmEdit,
  budgetCategories,
  loadCategories,
  syncBudgetToExpense,
}: {
  confirmSelection: BudgetType | null
  setConfirmSelection: HookSetter<BudgetType | null>
  setBudgetEditDialogOpen: HookSetter<boolean>
  setConfirmEdit: HookSetter<BudgetType | null>
  budgetCategories: BudgetType[]
  loadCategories: () => Promise<void>
  syncBudgetToExpense: (
    budgetCategory: BudgetType,
    userId: string,
  ) => Promise<void>
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

  const listItemColor =
    currentTheme === "light" ? lightMode.elevatedBg : darkMode.elevatedBg
  const budgetTotal = budgetCategories.reduce((sum, c) => sum + c.amount, 0)
  const categoryExists = budgetCategories.some(
    (c) => c.category.toLowerCase() === budgetCategory.category.toLowerCase(),
  )

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

  const handleDeleteItem = async () => {
    if (!user || !confirmSelection) return

    await deleteBudgetCategory({
      userId: user.id,
      rowId: confirmSelection.id,
    })

    setConfirmSelection(null)
    loadCategories()
  }

  return (
    <ShowCaseCard title={""}>
      <Stack direction={"column"} spacing={1}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography>Weekly Budget</Typography>
          <Typography>{`$${formattedStringNumber(budgetTotal)} Total`}</Typography>
        </Stack>
        <Stack height={"325px"} spacing={1}>
          <Stack direction={"column"} spacing={1}>
            <Stack direction={"row"} height={"100%"}>
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

              <MoneyInput
                value={budgetCategory.amount}
                setValue={setBudgetCategory}
              />
            </Stack>

            <Button
              variant={"contained"}
              disabled={
                budgetCategory.category === "" ||
                budgetCategory.amount === 0 ||
                categoryExists
              }
              onClick={save}
              sx={{
                backgroundColor: accentColorSecondary,
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
                          onDelete={async () => {
                            handleDeleteItem()
                          }}
                          onSetDelete={() => {
                            setConfirmSelection(entry)
                          }}
                          onCancelDelete={() => {
                            setConfirmSelection(null)
                          }}
                          onEdit={() => {
                            if (setBudgetEditDialogOpen && setConfirmEdit) {
                              setBudgetEditDialogOpen(true)
                              setConfirmEdit(entry)
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
      </Stack>
    </ShowCaseCard>
  )
}

export default AddBudget
