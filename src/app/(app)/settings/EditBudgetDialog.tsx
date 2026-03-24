import { updateBudgetCategory } from "@/app/api/Choices/requests"
import MoneyInput from "@/components/MoneyInput"
import { useCategoryContext } from "@/contexts/categories-context"
import { useUser } from "@/hooks/useUser"
import { AlertToastType, BudgetType, HookSetter } from "@/utils/type"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  IconButton,
  Typography,
} from "@mui/material"
import { RefObject, useEffect, useState } from "react"
import CloseIcon from "@mui/icons-material/Close"
import SaveIcon from "@mui/icons-material/Save"

const UPDATE_BUDGET_INIT: BudgetType = {
  id: 0,
  category: "",
  amount: 0,
}

const EditBudgetDialog = ({
  budgetEditDialogOpen,
  setBudgetEditDialogOpen,
  confirmEdit,
  setAlertToast,
  inputRef,
}: {
  budgetEditDialogOpen: boolean
  setBudgetEditDialogOpen: HookSetter<boolean>
  confirmEdit: BudgetType | null
  setAlertToast: HookSetter<AlertToastType | undefined>
  inputRef: RefObject<HTMLInputElement | null>
}) => {
  const { loadCategories } = useCategoryContext()
  const user = useUser()

  const [updateBudget, setUpdateBudget] =
    useState<BudgetType>(UPDATE_BUDGET_INIT)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!confirmEdit) return
    setUpdateBudget(confirmEdit)
  }, [confirmEdit])

  const handleUpdateBudgetData = async () => {
    if (!user || !updateBudget || !confirmEdit) return
    setIsLoading(true)
    try {
      await updateBudgetCategory({
        userId: user.id,
        rowId: confirmEdit.id,
        body: updateBudget,
      })
      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "success",
        message: "Budget updated successfully!",
      })
    } catch (error) {
      console.error(error)
      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "error",
        message: "Budget could not be updated.",
      })
    } finally {
      await loadCategories()
      setIsLoading(false)
      setBudgetEditDialogOpen(false)
    }
  }

  if (!updateBudget) return null

  return (
    <Dialog open={budgetEditDialogOpen}>
      <DialogTitle>
        <Stack
          width={"100%"}
          height={"100%"}
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <IconButton
            onClick={() => {
              setBudgetEditDialogOpen(false)
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography>{`Edit ${confirmEdit?.category}`}</Typography>
          <IconButton
            loading={isLoading}
            disabled={updateBudget.amount === 0}
            onClick={handleUpdateBudgetData}
          >
            <SaveIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <MoneyInput
          value={updateBudget.amount}
          setValue={setUpdateBudget}
          inputRef={inputRef}
          autoFocus={budgetEditDialogOpen}
        />
      </DialogContent>
    </Dialog>
  )
}

export default EditBudgetDialog
