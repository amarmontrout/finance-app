import { TransactionTypeValue } from "@/api/v2/models"
import { ToggleButton, ToggleButtonGroup } from "@mui/material"
import { useTransactionContext } from "../../v2/TransactionsContext"

const TransactionTypeToggle = () => {
  const { displayType, setDisplayType } = useTransactionContext()

  const handleSelectType = (
    _: React.MouseEvent<HTMLElement>,
    newType: Partial<TransactionTypeValue>,
  ) => {
    if (newType !== null) {
      setDisplayType(newType)
    }
  }

  return (
    <ToggleButtonGroup
      value={displayType}
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
          borderColor: "#102A1B",
        },
      }}
    >
      <ToggleButton
        className="text-dark-4 dark:text-dark-6"
        value={"Income"}
        disableRipple
        sx={{
          "&.Mui-selected": {
            color: "#102A1B",
          },
        }}
      >
        Income
      </ToggleButton>

      <ToggleButton
        className="text-dark-4 dark:text-dark-6"
        value={"Expense"}
        disableRipple
        sx={{
          "&.Mui-selected": {
            color: "#102A1B",
          },
        }}
      >
        Expense
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export default TransactionTypeToggle
