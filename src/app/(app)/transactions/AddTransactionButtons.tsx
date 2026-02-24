import { lightMode, darkMode, accentColorSecondary } from "@/globals/colors"
import { Stack, Button } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { HookSetter } from "@/utils/type"

const AddTransactionButtons = ({
  setOpenAddIncomeDialog,
  setOpenAddExpenseDialog,
  currentTheme,
}: {
  setOpenAddIncomeDialog: HookSetter<boolean>
  setOpenAddExpenseDialog: HookSetter<boolean>
  currentTheme: string | undefined
}) => {
  return (
    <Stack direction={"row"} justifyContent={"space-evenly"}>
      <Button
        onClick={() => {
          setOpenAddIncomeDialog(true)
        }}
        size="large"
        sx={{
          backgroundColor: accentColorSecondary,
          color:
            currentTheme === "light"
              ? lightMode.primaryText
              : darkMode.primaryText,
        }}
      >
        <AddIcon />
        Add Income
      </Button>

      <Button
        onClick={() => {
          setOpenAddExpenseDialog(true)
        }}
        size="large"
        sx={{
          backgroundColor: accentColorSecondary,
          color:
            currentTheme === "light"
              ? lightMode.primaryText
              : darkMode.primaryText,
        }}
      >
        <AddIcon />
        Add Expense
      </Button>
    </Stack>
  )
}

export default AddTransactionButtons
