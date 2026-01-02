"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import DeleteIcon from '@mui/icons-material/Delete'
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
import { BudgetCategoryType, useBudgetContext } from "@/contexts/budget-context"
import { accentColorSecondary, darkMode, lightMode } from "@/globals/colors"
import { BUDGET_CATEGORIES_KEY } from "@/globals/globals"
import { 
  Box, 
  Button, 
  FormControl, 
  IconButton, 
  InputAdornment, 
  InputLabel, 
  List, 
  ListItem, 
  ListItemText, 
  OutlinedInput, 
  Stack
} from "@mui/material"
import { useTheme } from "next-themes"
import { ChangeEvent, useEffect, useState } from "react"
import { saveBudgetCategories } from "@/utils/budgetStorage"

const BUDGET_INIT: BudgetCategoryType = {
  category: "",
  amount: ""
}

const AddBudget = ({ 
  confirmSelection,
  setConfirmSelection,
  setBudgetEditDialogOpen,
  setConfirmEdit
}: { 
  confirmSelection: BudgetCategoryType | null
  setConfirmSelection: React.Dispatch<React.SetStateAction<BudgetCategoryType | null>>
  setBudgetEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  setConfirmEdit: React.Dispatch<React.SetStateAction<BudgetCategoryType | null>>
}) => {
  const {budgetCategories, refreshBudgetCategories} = useBudgetContext()

  useEffect(() => {
    refreshBudgetCategories()
  }, [])

  const [budgetCategory, setBudgetCategory] = 
    useState<BudgetCategoryType>(BUDGET_INIT)

  const { theme: currentTheme } = useTheme()
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

  const handleAmount = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let digits = e.target.value.replace(/\D/g, "");
    const cents = digits.slice(-2);
    let dollars = digits.slice(0, -2);
    dollars = dollars.replace(/^0+/, "");
    const formatted = `${dollars}.${cents}`;

    if (formatted.length <= 7) {
      setBudgetCategory(prev => ({
        ...prev,
        amount: dollars || cents ? formatted : "",
      }));
    }
  }

  const resetFormData = () => {
    setBudgetCategory(BUDGET_INIT)
  }

  const save = () => {
    saveBudgetCategories({
      key: BUDGET_CATEGORIES_KEY, 
      budgetCategory: budgetCategory
    })
    refreshBudgetCategories()
    resetFormData()
  }

  const handleDeleteItem = () => {
    const newBudgetList = budgetCategories.filter(
      (selection) => {return selection.category !== confirmSelection?.category}
    )

    saveBudgetCategories({key: BUDGET_CATEGORIES_KEY, updatedCategories: newBudgetList})
    refreshBudgetCategories()
  }

  const EditDeleteButton = (props: {
    selection: BudgetCategoryType
  }) => {

    const { selection } = props

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
        <Box className="flex flex-row gap-2 pb-[12px]">
          <FormControl>
            <InputLabel>Category</InputLabel>
            <OutlinedInput
              className="w-full sm:w-[175px]"
              label={"Category"}
              value={budgetCategory.category}
              name={"category"}
              onChange={e => handleCategory(e)}
              />
          </FormControl>

          <FormControl>
            <InputLabel>Amount</InputLabel>
            <OutlinedInput
              className="w-full sm:w-[175px]"
              label={"Amount"}
              value={budgetCategory.amount}
              name={"amount"}
              onChange={e => handleAmount(e)}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              />
          </FormControl> 

          <Button
            variant={"contained"} 
            disabled={
              budgetCategory.category === ""
              || budgetCategory.amount === ""
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
            { budgetCategories &&
              (budgetCategories).map((budget) => {                 
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
                      borderRadius: "10px"
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