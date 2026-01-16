import { updateBudgetCategory } from "@/app/api/Choices/requests"
import { MoneyInputV2 } from "@/components/MoneyInput"
import { useCategoryContext } from "@/contexts/categories-context"
import { lightMode, darkMode } from "@/globals/colors"
import { useUser } from "@/hooks/useUser"
import { BudgetTypeV2 } from "@/utils/type"
import { 
  Dialog, 
  DialogTitle, 
  Box, 
  DialogActions, 
  Button,
  DialogContent, 
} from "@mui/material"
import { useEffect, useState } from "react"

  const UPDATE_BUDGET_INIT: BudgetTypeV2 = {
    id: 0,
    category: "",
    amount: 0,
  }

const EditBudgetDialog = ({
  budgetEditDialogOpen,
  setBudgetEditDialogOpen,
  confirmEdit,
  currentTheme
}: {
  budgetEditDialogOpen: boolean
  setBudgetEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  confirmEdit: BudgetTypeV2 | null
  currentTheme: string | undefined
}) => {
  const { refreshBudgetCategoryChoicesV2 } = useCategoryContext()
  const user = useUser()

  const [updateBudget, setUpdateBudget] =
    useState<BudgetTypeV2>(UPDATE_BUDGET_INIT)

  useEffect(() => {
    if (!confirmEdit) return
    setUpdateBudget(confirmEdit)
  }, [confirmEdit])

  const handleUpdateBudgetData = async () => {
    if (!user || !updateBudget || !confirmEdit) return

    await updateBudgetCategory({
      userId: user.id,
      rowId: confirmEdit.id,
      body: updateBudget
    })
    setBudgetEditDialogOpen(false)
    refreshBudgetCategoryChoicesV2()
  }
  if (!updateBudget) return null
  return (
    <Dialog open={budgetEditDialogOpen}>
      <DialogTitle>
        {`Edit ${confirmEdit?.category}`}
      </DialogTitle>

      <DialogContent>
        <Box padding={"10px"}>
          <MoneyInputV2
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