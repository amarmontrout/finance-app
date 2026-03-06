import { HookSetter } from "@/utils/type"
import { ToggleButton, ToggleButtonGroup } from "@mui/material"
import React from "react"

const ExpenseViewToggle = ({
  view,
  setView,
}: {
  view: "Debit" | "Credit" | "Both"
  setView: HookSetter<"Debit" | "Credit" | "Both">
}) => {
  const handleSelectType = (
    event: React.MouseEvent<HTMLElement>,
    newView: "Debit" | "Credit" | "Both" | null,
  ) => {
    if (newView !== null) {
      setView(newView)
    }
  }
  return (
    <ToggleButtonGroup
      value={view}
      exclusive
      size={"small"}
      onChange={handleSelectType}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "& .MuiToggleButton-root": {
          border: "none",
          px: 2.5,
          textTransform: "none",
          fontWeight: 400,
          color: "text.secondary",
          backgroundColor: "transparent",
          "&.Mui-selected": {
            backgroundColor: "transparent",
            color: "primary.main",
          },
          "&.Mui-selected:hover": {
            backgroundColor: "transparent",
          },
        },
        "& .MuiToggleButton-root:not(:last-of-type)": {
          borderRight: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      <ToggleButton value={"Debit"} color={"primary"} disableRipple>
        Debit
      </ToggleButton>

      <ToggleButton value={"Credit"} color={"primary"} disableRipple>
        Credit
      </ToggleButton>

      <ToggleButton value={"Both"} color={"primary"} disableRipple>
        Both
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export default ExpenseViewToggle
