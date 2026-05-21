import { neutralColor } from "@/global/colors";
import { HookSetter } from "@/types/types";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const ExpenseViewToggle = ({
  view,
  setView,
}: {
  view: "Debit" | "Credit" | "Both";
  setView: HookSetter<"Debit" | "Credit" | "Both">;
}) => {
  const handleToggle = (clicked: "Debit" | "Credit") => {
    if (view === "Debit") {
      setView(clicked === "Debit" ? "Credit" : "Both");
      return;
    }

    if (view === "Credit") {
      setView(clicked === "Debit" ? "Both" : "Debit");
      return;
    }

    // currently "Both"
    setView(clicked === "Debit" ? "Debit" : "Credit");
  };

  return (
    <ToggleButtonGroup
      value={view === "Both" ? ["Debit", "Credit"] : [view]}
      size="small"
      sx={{
        "& .MuiToggleButton-root": {
          border: "none",
          textTransform: "none",
          backgroundColor: "transparent",
          "&.Mui-selected": {
            backgroundColor: "transparent",
            color: neutralColor.color,
          },
          "&.Mui-selected:hover": { backgroundColor: "transparent" },
        },
        "& .MuiToggleButton-root:not(:last-of-type)": {
          borderRight: "1px solid",
          borderColor: neutralColor.bg,
        },
      }}
    >
      <ToggleButton
        className="text-dark-4 dark:text-dark-6"
        value="Debit"
        disableRipple
        onClick={() => handleToggle("Debit")}
      >
        Debit
      </ToggleButton>

      <ToggleButton
        className="text-dark-4 dark:text-dark-6"
        value="Credit"
        disableRipple
        onClick={() => handleToggle("Credit")}
      >
        Credit
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ExpenseViewToggle;
