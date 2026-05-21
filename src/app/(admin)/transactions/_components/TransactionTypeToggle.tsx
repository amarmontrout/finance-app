import { negativeColor, neutralColor, positiveColor } from "@/global/colors"
import { HookSetter } from "@/types/types"
import { ToggleButton, ToggleButtonGroup } from "@mui/material"

const TransactionTypeToggle = ({
  type,
  setType,
}: {
  type: "income" | "expense"
  setType: HookSetter<"income" | "expense">
}) => {
  const handleSelectType = (
    event: React.MouseEvent<HTMLElement>,
    newType: "income" | "expense" | null,
  ) => {
    if (newType !== null) {
      setType(newType)
    }
  }
  return (
    <ToggleButtonGroup
      value={type}
      exclusive
      onChange={handleSelectType}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "& .MuiToggleButton-root": {
          border: "none",
          textTransform: "none",
          fontWeight: 400,
          backgroundColor: "transparent",
          "&.Mui-selected": {
            backgroundColor: "transparent",
          },
          "&.Mui-selected:hover": {
            backgroundColor: "transparent",
          },
        },
        "& .MuiToggleButton-root:not(:last-of-type)": {
          borderRight: "1px solid",
          borderColor: neutralColor.bg,
        },
      }}
    >
      <ToggleButton
        className="text-dark-4 dark:text-dark-6"
        value={"income"}
        disableRipple
        sx={{
          "&.Mui-selected": {
            color: positiveColor.color,
          },
        }}
      >
        Income
      </ToggleButton>

      <ToggleButton
        className="text-dark-4 dark:text-dark-6"
        value={"expense"}
        disableRipple
        sx={{
          "&.Mui-selected": {
            color: negativeColor.color,
          },
        }}
      >
        Expense
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export default TransactionTypeToggle
