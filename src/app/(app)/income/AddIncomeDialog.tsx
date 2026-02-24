import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material"
import { darkMode, lightMode } from "@/globals/colors"
import { ChoiceTypeV2, HookSetter } from "@/utils/type"
import { useTheme } from "next-themes"
import TransactionForm from "@/components/TransactionForm"

const AddIncomeDialog = ({
  incomeCategories,
  income,
  refreshIncomeTransactions,
  years,
  openAddIncomeDialog,
  setOpenAddIncomeDialog,
}: {
  incomeCategories: ChoiceTypeV2[]
  income: "income"
  refreshIncomeTransactions: () => void
  years: ChoiceTypeV2[]
  openAddIncomeDialog: boolean
  setOpenAddIncomeDialog: HookSetter<boolean>
}) => {
  const { theme: currentTheme } = useTheme()
  return (
    <Dialog open={openAddIncomeDialog} fullWidth>
      <DialogTitle>{"Enter Income"}</DialogTitle>

      <DialogContent>
        <TransactionForm
          categories={incomeCategories}
          type={income}
          refreshTransactions={refreshIncomeTransactions}
          years={years}
        />
      </DialogContent>

      <DialogActions>
        <Button
          variant={"contained"}
          disabled={false}
          onClick={() => {
            setOpenAddIncomeDialog(false)
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

export default AddIncomeDialog
