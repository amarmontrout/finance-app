import { BudgetType, ChoiceType } from "@/api/choices/models"
import { CloseIcon } from "@/assets/icons"
import { AlertToastType, HookSetter } from "@/types/types"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material"
import AddBudgetForm from "./AddBudgetForm"

const AddBudgetDialog = ({
  openBudgetDialog,
  setOpenBudgetDialog,
  confirmSelection,
  setConfirmSelection,
  budgetCategories,
  loadCategories,
  expenseCategories,
  setAlertToast,
}: {
  openBudgetDialog: boolean
  setOpenBudgetDialog: HookSetter<boolean>
  confirmSelection: BudgetType | null
  setConfirmSelection: HookSetter<BudgetType | null>
  budgetCategories: BudgetType[]
  loadCategories: () => Promise<void>
  expenseCategories: ChoiceType[]
  setAlertToast: HookSetter<AlertToastType | undefined>
}) => {
  const handleClose = () => {
    setOpenBudgetDialog(false)
  }

  return (
    <Dialog open={openBudgetDialog} fullScreen>
      <DialogTitle className="bg-gray-2 text-dark-4 dark:bg-[#020D1A] dark:text-dark-6">
        <Stack
          direction={"row"}
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ width: "100%", textAlign: "center" }}>
            Add Monthly Budget
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 0 }}
          >
            <CloseIcon className="text-dark-4 dark:text-dark-6" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent className="bg-gray-2 text-dark-4 dark:bg-[#020D1A] dark:text-dark-6">
        <AddBudgetForm
          confirmSelection={confirmSelection}
          setConfirmSelection={setConfirmSelection}
          budgetCategories={budgetCategories}
          loadCategories={loadCategories}
          expenseCategories={expenseCategories}
          setAlertToast={setAlertToast}
        />
      </DialogContent>
    </Dialog>
  )
}

export default AddBudgetDialog
