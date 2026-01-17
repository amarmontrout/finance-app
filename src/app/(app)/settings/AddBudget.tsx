"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import DeleteIcon from '@mui/icons-material/Delete'
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
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
  Stack
} from "@mui/material"
import { useTheme } from "next-themes"
import { ChangeEvent, useState } from "react"
import { MoneyInputV2 } from "@/components/MoneyInput"
import { BudgetTypeV2, HookSetter } from "@/utils/type"
import { makeId } from "@/utils/helperFunctions"
import { useCategoryContext } from "@/contexts/categories-context"
import { deleteBudgetCategory, saveBudgetCategory } from "@/app/api/Choices/requests"
import { useUser } from "@/hooks/useUser"

const BUDGET_INIT: BudgetTypeV2 = {
  id: Number(makeId(8)),
  category: "",
  amount: 0
}

const AddBudget = ({ 
  confirmSelection,
  setConfirmSelection,
  setBudgetEditDialogOpen,
  setConfirmEdit
}: { 
  confirmSelection: BudgetTypeV2 | null
  setConfirmSelection: HookSetter<BudgetTypeV2 | null>
  setBudgetEditDialogOpen: HookSetter<boolean>
  setConfirmEdit: HookSetter<BudgetTypeV2 | null>
}) => {
  const { budgetCategoriesV2, refreshBudgetCategoryChoicesV2 } = useCategoryContext()
  const { theme: currentTheme } = useTheme()
  const user = useUser()

  const [budgetCategory, setBudgetCategory] = 
    useState<BudgetTypeV2>(BUDGET_INIT)

  const listItemColor = currentTheme === "light" ?
    lightMode.elevatedBg 
    : darkMode.elevatedBg

  const handleCategory = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBudgetCategory(prev => ({
      ...prev,
      category: e.target.value,
    }));
  }

  const resetFormData = () => {
    setBudgetCategory(BUDGET_INIT)
  }

  const save = async () => {
    if (!user) return
    await saveBudgetCategory({
      userId: user.id,
      body: budgetCategory
    })
    refreshBudgetCategoryChoicesV2()
    resetFormData()
  }

  const handleDeleteItem = async () => {
    if (!user || !confirmSelection) return
    await deleteBudgetCategory({
      userId: user.id,
      rowId: confirmSelection.id
    })
    refreshBudgetCategoryChoicesV2()
  }

  const EditDeleteButton = ({ selection }: {
    selection: BudgetTypeV2
  }) => {
    return (
      <Stack direction={"row"} gap={2}>
        {
          <IconButton 
            edge="end"
            onClick={
              () => {
                if (setBudgetEditDialogOpen && setConfirmEdit) {
                  setBudgetEditDialogOpen(true)
                  setConfirmEdit(selection)
                }
              }
            }
          >
            <EditIcon/>
          </IconButton>
        }

        <IconButton 
          edge="end"
          onClick={
            () => {
              setConfirmSelection(selection)
            }
          }
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    )
  }

  const ConfirmCancel = () => {
    return (
      <Stack direction={"row"} gap={2}>
        <IconButton 
          edge="end"
          onClick={
            () => {
              handleDeleteItem()
            }
          }
        >
          <DeleteIcon/>
        </IconButton>

        <IconButton 
          edge="end"
          onClick={
            () => {
              setConfirmSelection(null)
            }
          }
        >
          <CancelIcon/>
        </IconButton>
      </Stack>
    )
  }

  return (
    <ShowCaseCard title={"Add Weekly Budget"}>
      <Box
        display={"flex"}
        flexDirection={"column"}
        overflow={"hidden"}
        paddingTop={"5px"}
      >
        <Box className="flex flex-row xl:flex-col gap-3 pb-[12px]">
          <FormControl>
            <InputLabel>Category</InputLabel>
            <OutlinedInput
              className="w-full"
              label={"Category"}
              value={budgetCategory.category}
              name={"category"}
              onChange={e => handleCategory(e)}
              />
          </FormControl>

          <MoneyInputV2
            value={budgetCategory.amount}
            setValue={setBudgetCategory}
          />

          <Button
            variant={"contained"} 
            disabled={
              budgetCategory.category === ""
              || budgetCategory.amount === 0
            }
            onClick={save}
            sx={{
              backgroundColor: accentColorSecondary
            }}
          >
            {"Add"}
          </Button>
        </Box>

        <hr style={{ width: "100%" }} />

        <Box
          flex={1}
          overflow={"auto"}
        >
          <List className="flex flex-col gap-2">
            { budgetCategoriesV2 &&
              (budgetCategoriesV2).map((budget) => {                 
                return (
                  <ListItem
                    key={budget.category} 
                    secondaryAction={
                      confirmSelection === budget
                      ? <ConfirmCancel/> 
                      : <EditDeleteButton selection={budget}/>
                    }
                    sx={{ 
                      backgroundColor: listItemColor,
                      borderRadius: "15px"
                    }}
                  >
                    <ListItemText 
                      primary={budget.category} 
                      secondary={`$${budget.amount}`}
                    />
                  </ListItem>
                )
              })
            }
          </List>
        </Box>
      </Box>
    </ShowCaseCard>
  )
}

export default AddBudget