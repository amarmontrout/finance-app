import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material"
import BudgetEntryForm from "./BudgetEntryForm"
import { darkMode, lightMode } from "@/globals/colors"
import { BudgetTypeV2, DateType, HookSetter } from "@/utils/type"
import { User } from "@supabase/supabase-js"

const AddBudgetEntryDialog = ({
  openAddBudgetEntryDialog,
  setOpenAddBudgetEntryDialog,
  budgetCategories,
  today,
  user,
  week,
  refreshBudgetTransactions,
  notes,
  currentTheme,
}: {
  openAddBudgetEntryDialog: boolean
  setOpenAddBudgetEntryDialog: HookSetter<boolean>
  budgetCategories: BudgetTypeV2[]
  today: DateType
  user: User | null
  week: "current" | "prev"
  refreshBudgetTransactions: () => void
  notes: string[]
  currentTheme: string | undefined
}) => {
  return (
    <Dialog open={openAddBudgetEntryDialog} fullWidth>
      <DialogTitle>{"Add Budget Entry"}</DialogTitle>

      <DialogContent>
        <BudgetEntryForm
          budgetCategories={budgetCategories}
          today={today}
          user={user}
          refreshBudgetTransactions={refreshBudgetTransactions}
          week={week}
          notes={notes}
        />
      </DialogContent>

      <DialogActions>
        <Button
          variant={"contained"}
          disabled={false}
          onClick={() => {
            setOpenAddBudgetEntryDialog(false)
          }}
          sx={{
            backgroundColor:
              currentTheme === "light" ? [lightMode.error] : [darkMode.error],
          }}
        >
          {"Cancel"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddBudgetEntryDialog
