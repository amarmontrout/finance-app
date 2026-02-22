import TransactionForm from "@/components/TransactionForm"
import { darkMode, lightMode } from "@/globals/colors"
import { ChoiceTypeV2, HookSetter } from "@/utils/type"
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle 
} from "@mui/material"
import { useTheme } from "next-themes"

const AddExpenseDialog = ({
  expenseCategories,
  expenses,
  refreshExpenseTransactions,
  years,
  openAddExpenseDialog,
  setOpenAddExpenseDialog
}: {
  expenseCategories: ChoiceTypeV2[]
  expenses: "expenses"
  refreshExpenseTransactions: () => void
  years: ChoiceTypeV2[]
  openAddExpenseDialog: boolean
  setOpenAddExpenseDialog: HookSetter<boolean>
}) => {
  const { theme: currentTheme } = useTheme()

  return (
    <Dialog open={openAddExpenseDialog}>
      <DialogTitle>
        {"Enter Expense"}
      </DialogTitle>

      <DialogContent>
        <TransactionForm
          categories={expenseCategories}
          type={expenses}
          refreshTransactions={refreshExpenseTransactions}
          years={years}
        />
      </DialogContent>

      <DialogActions>
        <Button 
          variant={"contained"} 
          disabled={
            false
          }
          onClick={() => {setOpenAddExpenseDialog(false)}}
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

export default AddExpenseDialog