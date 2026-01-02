import { BudgetCategoryType, useBudgetContext } from "@/contexts/budget-context"
import { lightMode, darkMode } from "@/globals/colors"
import { BUDGET_CATEGORIES_KEY } from "@/globals/globals"
import { updateBudgetCategories } from "@/utils/budgetStorage"
import { 
  Dialog, 
  DialogTitle, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  OutlinedInput, 
  InputAdornment, 
  DialogActions, 
  Button, 
  SelectChangeEvent
} from "@mui/material"
import { ChangeEvent, useEffect, useState } from "react"

const EditBudgetDialog = ({
  budgetEditDialogOpen,
  setBudgetEditDialogOpen,
  confirmEdit,
  currentTheme
}: {
  budgetEditDialogOpen: boolean
  setBudgetEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  confirmEdit: BudgetCategoryType | null
  currentTheme: string | undefined
}) => {

  const {
    budgetCategories,
    refreshBudgetCategories
  } = useBudgetContext()

  const UPDATE_BUDGET_INIT: BudgetCategoryType = {
    category: budgetCategories[0].category,
    amount: ""
  }

  const [updateBudget, setUpdateBudget] = 
    useState<BudgetCategoryType>(UPDATE_BUDGET_INIT)

  useEffect(() => {
    refreshBudgetCategories()
  }, [])

  useEffect(() => {
    if (!confirmEdit) return

    setUpdateBudget({
      category: confirmEdit.category,
      amount: confirmEdit.amount,
    })
  }, [confirmEdit])

  const handleCategory = (e: SelectChangeEvent) => {
    const { value } = e.target
    setUpdateBudget(prev => ({
      ...prev,
      category: value,
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
      setUpdateBudget(prev => ({
        ...prev,
        amount: dollars || cents ? formatted : "",
      }));
    }
  }

  const handleUpdateBudgetData = () => {
    updateBudgetCategories(
      BUDGET_CATEGORIES_KEY,
      updateBudget
    )
    setBudgetEditDialogOpen(false)
    refreshBudgetCategories()
  }

  return (
    <Dialog open={budgetEditDialogOpen}>
      <DialogTitle>
        {`Edit Budget`}
      </DialogTitle>

      <Box
        className="flex flex-col gap-5"
        width={"fit-content"}
        padding={"10px"}
        margin={"0 auto"}
      >
        <FormControl>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={updateBudget.category}
            name={"category"}
            onChange={e => handleCategory(e)}
            sx={{
              width: "100%"
            }}
          >
            {budgetCategories.map((category) => {
              return (
              <MenuItem 
                value={category.category}
              >
                {category.category}
              </MenuItem>
            )
            })}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Amount</InputLabel>
          <OutlinedInput
            label={"Amount"}
            value={updateBudget.amount}
            name={"amount"}
            onChange={e => handleAmount(e)}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            sx={{
              width: "100%"
            }}
            />
        </FormControl>

        <DialogActions>
          <Button 
            variant={"contained"} 
            disabled={
              false
            }
            onClick={handleUpdateBudgetData}
            sx={{
              backgroundColor: currentTheme === "light" 
                ? [lightMode.success] 
                : [darkMode.success]
            }}
          >
            {"Update"}
          </Button>
          <Button 
            variant={"contained"} 
            disabled={
              false
            }
            onClick={() => {
              setBudgetEditDialogOpen(false)
            }}
            sx={{
              backgroundColor: currentTheme === "light" 
                ? [lightMode.error] 
                : [darkMode.error]
            }}
          >
            {"Cancel"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default EditBudgetDialog