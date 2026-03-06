import ShowCaseCard from "@/components/ShowCaseCard"
import DeleteIcon from "@mui/icons-material/Delete"
import CancelIcon from "@mui/icons-material/Cancel"
import EditIcon from "@mui/icons-material/Edit"
import { accentColorSecondary, darkMode, lightMode } from "@/globals/colors"
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material"
import { useTheme } from "next-themes"
import { ChangeEvent, useState } from "react"
import { MoneyInputV2 } from "@/components/MoneyInput"
import { BudgetTypeV2, HookSetter } from "@/utils/type"
import { formattedStringNumber, makeId } from "@/utils/helperFunctions"
import {
  deleteBudgetCategory,
  saveBudgetCategory,
} from "@/app/api/Choices/requests"
import { useUser } from "@/hooks/useUser"

const EditDeleteButton = ({
  selection,
  setConfirmSelection,
  setBudgetEditDialogOpen,
  setConfirmEdit,
}: {
  selection: BudgetTypeV2
  setConfirmSelection: HookSetter<BudgetTypeV2 | null>
  setBudgetEditDialogOpen: HookSetter<boolean>
  setConfirmEdit: HookSetter<BudgetTypeV2 | null>
}) => {
  return (
    <Stack direction={"row"} gap={2}>
      {
        <IconButton
          edge="end"
          onClick={() => {
            if (setBudgetEditDialogOpen && setConfirmEdit) {
              setBudgetEditDialogOpen(true)
              setConfirmEdit(selection)
            }
          }}
        >
          <EditIcon />
        </IconButton>
      }

      <IconButton
        edge="end"
        onClick={() => {
          setConfirmSelection(selection)
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Stack>
  )
}

const ConfirmCancel = ({
  handleDeleteItem,
  setConfirmSelection,
}: {
  handleDeleteItem: () => Promise<void>
  setConfirmSelection: HookSetter<BudgetTypeV2 | null>
}) => {
  return (
    <Stack direction={"row"} gap={2}>
      <IconButton
        edge="end"
        onClick={() => {
          handleDeleteItem()
        }}
      >
        <DeleteIcon />
      </IconButton>

      <IconButton
        edge="end"
        onClick={() => {
          setConfirmSelection(null)
        }}
      >
        <CancelIcon />
      </IconButton>
    </Stack>
  )
}

const AddBudget = ({
  confirmSelection,
  setConfirmSelection,
  setBudgetEditDialogOpen,
  setConfirmEdit,
  budgetCategoriesV2,
  loadCategories,
  syncBudgetToExpense,
}: {
  confirmSelection: BudgetTypeV2 | null
  setConfirmSelection: HookSetter<BudgetTypeV2 | null>
  setBudgetEditDialogOpen: HookSetter<boolean>
  setConfirmEdit: HookSetter<BudgetTypeV2 | null>
  budgetCategoriesV2: BudgetTypeV2[]
  loadCategories: () => Promise<void>
  syncBudgetToExpense: (
    budgetCategory: BudgetTypeV2,
    userId: string,
  ) => Promise<void>
}) => {
  const { theme: currentTheme } = useTheme()
  const user = useUser()

  const createBudgetInit = (): BudgetTypeV2 => ({
    id: makeId(),
    category: "",
    amount: 0,
  })

  const [budgetCategory, setBudgetCategory] =
    useState<BudgetTypeV2>(createBudgetInit())
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const listItemColor =
    currentTheme === "light" ? lightMode.elevatedBg : darkMode.elevatedBg
  const budgetTotal = budgetCategoriesV2.reduce((sum, c) => sum + c.amount, 0)
  const categoryExists = budgetCategoriesV2.some(
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
        <Box
          display={"flex"}
          flexDirection={"column"}
          overflow={"hidden"}
          paddingTop={"5px"}
          height={"325px"}
        >
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

              <MoneyInputV2
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

          <Box flex={1} overflow={"auto"} paddingRight={"10px"}>
            <List className="flex flex-col gap-2">
              {budgetCategoriesV2
                .slice()
                .sort((a, b) => a.category.localeCompare(b.category))
                .map((budget) => {
                  return (
                    <ListItem
                      key={budget.id}
                      secondaryAction={
                        confirmSelection?.id === budget.id ? (
                          <ConfirmCancel
                            handleDeleteItem={handleDeleteItem}
                            setConfirmSelection={setConfirmSelection}
                          />
                        ) : (
                          <EditDeleteButton
                            selection={budget}
                            setConfirmSelection={setConfirmSelection}
                            setBudgetEditDialogOpen={setBudgetEditDialogOpen}
                            setConfirmEdit={setConfirmEdit}
                          />
                        )
                      }
                      sx={{
                        backgroundColor: listItemColor,
                        borderRadius: "15px",
                      }}
                    >
                      <ListItemText
                        primary={`${budget.category} - $${formattedStringNumber(budget.amount)}/week`}
                      />
                    </ListItem>
                  )
                })}
            </List>
          </Box>
        </Box>
      </Stack>
    </ShowCaseCard>
  )
}

export default AddBudget
