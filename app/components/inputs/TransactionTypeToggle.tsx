import { TransactionTypeValue } from "@/app/(api)/transactions/models"
import { ACCENT_COLOR, TEXT_COLOR } from "@/app/data/colors"
import { HookSetter } from "@/app/lib/types"
import { ToggleButton, ToggleButtonGroup } from "@mui/material"

const TransactionTypeToggle = ({
  transactionType,
  setTransactionType,
}: {
  transactionType: TransactionTypeValue
  setTransactionType: HookSetter<TransactionTypeValue>
}) => {
  const handleSelectType = (
    _: React.MouseEvent<HTMLElement>,
    newType: Partial<TransactionTypeValue>,
  ) => {
    if (newType !== null) {
      setTransactionType(newType)
    }
  }

  return (
    <ToggleButtonGroup
      value={transactionType}
      exclusive
      onChange={handleSelectType}
      sx={{
        "& .MuiToggleButton-root": {
          border: "none",
          textTransform: "none",
          fontWeight: 400,
          backgroundColor: "transparent",
          "&.Mui-selected": { backgroundColor: "transparent" },
          "&.Mui-selected:hover": { backgroundColor: "transparent" },
        },
        "& .MuiToggleButton-root:not(:last-of-type)": {
          borderRight: "1px solid",
          borderColor: ACCENT_COLOR,
        },
      }}
    >
      <ToggleButton
        value={"Income"}
        disableRipple
        sx={{ color: TEXT_COLOR, "&.Mui-selected": { color: ACCENT_COLOR } }}
      >
        Income
      </ToggleButton>

      <ToggleButton
        value={"Expense"}
        disableRipple
        sx={{ color: TEXT_COLOR, "&.Mui-selected": { color: ACCENT_COLOR } }}
      >
        Expense
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export default TransactionTypeToggle
