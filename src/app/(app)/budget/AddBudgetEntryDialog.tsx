import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material"
import BudgetEntryForm from "./BudgetEntryForm"
import {
  AlertToastType,
  BudgetTransactionTypeV2,
  BudgetTypeV2,
  DateType,
  HookSetter,
} from "@/utils/type"
import { User } from "@supabase/supabase-js"
import CloseIcon from "@mui/icons-material/Close"
import SaveIcon from "@mui/icons-material/Save"
import { useState } from "react"
import { makeId } from "@/utils/helperFunctions"
import { saveBudget } from "@/app/api/Transactions/requests"

const AddBudgetEntryDialog = ({
  openAddBudgetEntryDialog,
  setOpenAddBudgetEntryDialog,
  budgetCategories,
  today,
  user,
  refreshBudgetTransactions,
  notes,
  setAlertToast,
}: {
  openAddBudgetEntryDialog: boolean
  setOpenAddBudgetEntryDialog: HookSetter<boolean>
  budgetCategories: BudgetTypeV2[]
  today: DateType
  user: User | null
  refreshBudgetTransactions: () => void
  notes: string[]
  setAlertToast: HookSetter<AlertToastType | undefined>
}) => {
  const BUDGET_ENTRY_INIT: BudgetTransactionTypeV2 = {
    id: Number(makeId(8)),
    category: "",
    note: "",
    amount: 0,
    isReturn: false,
    date: today,
  }

  const [budgetEntry, setBudgetEntry] =
    useState<BudgetTransactionTypeV2>(BUDGET_ENTRY_INIT)
  const [noteValue, setNoteValue] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const resetFormData = () => {
    setBudgetEntry(BUDGET_ENTRY_INIT)
  }

  const save = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      await saveBudget({
        userId: user.id,
        body: {
          ...budgetEntry,
        },
      })
      setAlertToast({
        open: true,
        onClose: () => {
          setAlertToast(undefined)
        },
        severity: "success",
        message: "Budget entry saved successfully!",
      })
    } catch (error) {
      console.error(error)
      setAlertToast({
        open: true,
        onClose: () => {
          setAlertToast(undefined)
        },
        severity: "error",
        message: "Budget entry could not be saved.",
      })
    } finally {
      setIsLoading(false)
      refreshBudgetTransactions()
      resetFormData()
      setOpenAddBudgetEntryDialog(false)
    }
  }

  return (
    <Dialog open={openAddBudgetEntryDialog} fullScreen>
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
              setOpenAddBudgetEntryDialog(false)
              resetFormData()
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography>{"Add Budget Entry"}</Typography>
          <IconButton
            loading={isLoading}
            disabled={budgetEntry.amount === 0 || budgetEntry.note === ""}
            onClick={save}
          >
            <SaveIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <BudgetEntryForm
          budgetEntry={budgetEntry}
          setBudgetEntry={setBudgetEntry}
          noteValue={noteValue}
          setNoteValue={setNoteValue}
          budgetCategories={budgetCategories}
          today={today}
          notes={notes}
          openAddBudgetEntryDialog={openAddBudgetEntryDialog}
        />
      </DialogContent>
    </Dialog>
  )
}

export default AddBudgetEntryDialog
