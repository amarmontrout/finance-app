import { HookSetter } from "@/utils/type"
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
      size={"small"}
      onChange={handleSelectType}
      sx={{
        width: "100%",
        justifyContent: "center",
        gap: 3,
        "& .MuiToggleButton-root": {
          borderRadius: "15px",
          border: "1px solid",
          px: 3,
          textTransform: "none",
        },
        "& .MuiToggleButtonGroup-grouped": {
          margin: 0,
          border: "1px solid",
          "&:not(:first-of-type)": {
            borderLeft: "1px solid",
          },
        },
      }}
    >
      <ToggleButton value={"income"} color={"success"}>
        Income
      </ToggleButton>

      <ToggleButton value={"expense"} color={"error"}>
        Expense
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export default TransactionTypeToggle
