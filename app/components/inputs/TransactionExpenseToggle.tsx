import { AccountTypeValue } from "@/app/(api)/accounts/models"
import { ACCENT_COLOR } from "@/app/data/colors"
import { HookSetter } from "@/app/lib/types"
import { ToggleButton, ToggleButtonGroup } from "@mui/material"

const TransactionExpenseToggle = ({
  expenseType,
  setExpenseType,
}: {
  expenseType: AccountTypeValue[]
  setExpenseType: HookSetter<AccountTypeValue[]>
}) => {
  const toggleExpenseType = (value: AccountTypeValue) => {
    setExpenseType((prev) => {
      if (prev.length === 2) {
        return [value]
      }
      if (prev.includes(value)) {
        return prev
      }
      return [...prev, value]
    })
  }

  return (
    <ToggleButtonGroup
      value={expenseType}
      size="small"
      sx={{
        "& .MuiToggleButton-root": {
          border: "none",
          textTransform: "none",
          backgroundColor: "transparent",
          "&.Mui-selected": {
            backgroundColor: "transparent",
            color: ACCENT_COLOR,
          },
          "&.Mui-selected:hover": { backgroundColor: "transparent" },
        },
        "& .MuiToggleButton-root:not(:last-of-type)": {
          borderRight: "1px solid",
          borderColor: ACCENT_COLOR,
        },
      }}
    >
      <ToggleButton
        className="text-dark-4 dark:text-dark-6"
        value="Checking"
        disableRipple
        onClick={() => toggleExpenseType("Checking")}
      >
        Debit
      </ToggleButton>

      <ToggleButton
        className="text-dark-4 dark:text-dark-6"
        value="Credit Card"
        disableRipple
        onClick={() => toggleExpenseType("Credit Card")}
      >
        Credit
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export default TransactionExpenseToggle
