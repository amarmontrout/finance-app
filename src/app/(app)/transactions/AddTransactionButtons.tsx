import { lightMode, darkMode, accentColorPrimary } from "@/globals/colors"
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { HookSetter } from "@/utils/type"
import { useState } from "react"

const AddTransactionButtons = ({
  setOpenAddIncomeDialog,
  setOpenAddExpenseDialog,
  currentTheme,
}: {
  setOpenAddIncomeDialog: HookSetter<boolean>
  setOpenAddExpenseDialog: HookSetter<boolean>
  currentTheme: string | undefined
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleIncomeClick = () => {
    setOpenAddIncomeDialog(true)
    handleCloseMenu()
  }

  const handleExpenseClick = () => {
    setOpenAddExpenseDialog(true)
    handleCloseMenu()
  }

  return (
    <>
      <IconButton
        onClick={handleOpenMenu}
        size="large"
        disableRipple
        sx={{
          position: "fixed",
          right: "20px",
          top: "78px",
          backgroundColor: accentColorPrimary,
          color: "white",
          zIndex: 100,
          boxShadow: `
            0 6px 12px rgba(0,0,0,0.18),
            0 12px 24px rgba(0,0,0,0.18),
            inset 0 1px 0 rgba(255,255,255,0.25)
          `,
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          "&:active": {
            boxShadow: `
              0 3px 6px rgba(0,0,0,0.25),
              inset 0 3px 6px rgba(0,0,0,0.25)
            `,
          },
        }}
      >
        <AddIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleIncomeClick}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText>Add Income</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleExpenseClick}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText>Add Expense</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

export default AddTransactionButtons
