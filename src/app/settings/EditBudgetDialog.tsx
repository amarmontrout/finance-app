import MoneyInput from "@/components/MoneyInput"
import { BudgetCategoryType, useBudgetContext } from "@/contexts/budget-context"
import { lightMode, darkMode } from "@/globals/colors"
import { BUDGET_CATEGORIES_KEY } from "@/globals/globals"
import { updateBudgetCategories } from "@/utils/budgetStorage"
import { 
  Dialog, 
  DialogTitle, 
  Box, 
  DialogActions, 
  Button,
  DialogContent, 
} from "@mui/material"
import { useEffect, useState } from "react"

  const UPDATE_BUDGET_INIT: BudgetCategoryType = {
    category: "",
    amount: ""
  }

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

  const { refreshBudgetCategories } = useBudgetContext()

  const [updateBudget, setUpdateBudget] = 
    useState<BudgetCategoryType>(confirmEdit? confirmEdit : UPDATE_BUDGET_INIT)

  useEffect(() => {
    if (!confirmEdit) return

    setUpdateBudget({
      category: confirmEdit.category,
      amount: confirmEdit.amount,
    })
  }, [confirmEdit])

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
        {`Edit ${confirmEdit?.category}`}
      </DialogTitle>

      <DialogContent>
        <Box padding={"10px"}>
          <MoneyInput
            value={updateBudget.amount}
            setValue={setUpdateBudget}
          />
        </Box>
      </DialogContent>
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
    </Dialog>
  )
}

export default EditBudgetDialog