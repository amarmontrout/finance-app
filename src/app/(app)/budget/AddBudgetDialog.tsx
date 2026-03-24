import {
  Dialog,
  DialogTitle,
  Stack,
  IconButton,
  DialogContent,
  Typography,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import {
  AlertToastType,
  BudgetType,
  ChoiceType,
  HookSetter,
} from "@/utils/type"
import AddBudgetForm from "./AddBudgetForm"
import { RefObject } from "react"

const AddBudgetDialog = ({
  openBudgetDialog,
  setOpenBudgetDialog,
  confirmSelection,
  setConfirmSelection,
  setBudgetEditDialogOpen,
  setConfirmEdit,
  budgetCategories,
  loadCategories,
  expenseCategories,
  inputRef,
  setAlertToast,
}: {
  openBudgetDialog: boolean
  setOpenBudgetDialog: HookSetter<boolean>
  confirmSelection: BudgetType | null
  setConfirmSelection: HookSetter<BudgetType | null>
  setBudgetEditDialogOpen: HookSetter<boolean>
  setConfirmEdit: HookSetter<BudgetType | null>
  budgetCategories: BudgetType[]
  loadCategories: () => Promise<void>
  expenseCategories: ChoiceType[]
  inputRef: RefObject<HTMLInputElement | null>
  setAlertToast: HookSetter<AlertToastType | undefined>
}) => {
  const handleClose = () => {
    setOpenBudgetDialog(false)
  }

  return (
    <Dialog open={openBudgetDialog} fullScreen>
      <DialogTitle>
        <Stack
          width={"100%"}
          height={"100%"}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          position={"relative"}
        >
          <Typography>Add Weekly Budget</Typography>
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 0 }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <AddBudgetForm
          confirmSelection={confirmSelection}
          setConfirmSelection={setConfirmSelection}
          setBudgetEditDialogOpen={setBudgetEditDialogOpen}
          setConfirmEdit={setConfirmEdit}
          budgetCategories={budgetCategories}
          loadCategories={loadCategories}
          expenseCategories={expenseCategories}
          inputRef={inputRef}
          setAlertToast={setAlertToast}
        />
      </DialogContent>
    </Dialog>
  )
}

export default AddBudgetDialog
