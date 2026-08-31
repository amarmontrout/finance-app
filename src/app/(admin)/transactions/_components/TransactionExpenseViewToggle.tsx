import { AccountTypeValue } from "@/api/v2/models"
import { HookSetter } from "@/types/types"
import { ToggleButton, ToggleButtonGroup } from "@mui/material"

const TransactionExpenseViewToggle = ({
  expenseView,
  setExpenseView,
}: {
  expenseView: Partial<AccountTypeValue> | "Both"
  setExpenseView: HookSetter<Partial<AccountTypeValue> | "Both">
}) => {
  const handleToggle = (clicked: Partial<AccountTypeValue> | "Both") => {
    if (expenseView === "Checking") {
      setExpenseView(clicked === "Checking" ? "Credit Card" : "Both")
      return
    }

    if (expenseView === "Credit Card") {
      setExpenseView(clicked === "Checking" ? "Both" : "Checking")
      return
    }

    // currently "Both"
    setExpenseView(clicked === "Checking" ? "Checking" : "Credit Card")
  }

  return (
    <ToggleButtonGroup
      value={
        expenseView === "Both" ? ["Checking", "Credit Card"] : [expenseView]
      }
      size="small"
      sx={{
        "& .MuiToggleButton-root": {
          border: "none",
          textTransform: "none",
          backgroundColor: "transparent",
          "&.Mui-selected": {
            backgroundColor: "transparent",
            color: "#102A1B",
          },
          "&.Mui-selected:hover": { backgroundColor: "transparent" },
        },
        "& .MuiToggleButton-root:not(:last-of-type)": {
          borderRight: "1px solid",
          borderColor: "#102A1B",
        },
      }}
    >
      <ToggleButton
        className="text-dark-4 dark:text-dark-6"
        value="Checking"
        disableRipple
        onClick={() => handleToggle("Checking")}
      >
        Debit
      </ToggleButton>

      <ToggleButton
        className="text-dark-4 dark:text-dark-6"
        value="Credit Card"
        disableRipple
        onClick={() => handleToggle("Credit Card")}
      >
        Credit
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export default TransactionExpenseViewToggle
