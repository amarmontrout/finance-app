"use client"

import { darkMode, lightMode } from "@/globals/colors"
import { Stack, IconButton, List, ListItem, ListItemText } from "@mui/material"
import { useTheme } from "next-themes"
import DeleteIcon from "@mui/icons-material/Delete"
import CancelIcon from "@mui/icons-material/Cancel"
import SettingsIcon from "@mui/icons-material/Settings"
import { useState } from "react"
import { ChoiceTypeV2 } from "@/utils/type"
import {
  deleteBudgetCategory,
  deleteExpenseCategory,
  deleteIncomeCategory,
  deleteYearChoice,
} from "@/app/api/Choices/requests"
import { useUser } from "@/hooks/useUser"

const EditDeleteListItem = ({
  type,
  items,
  refresh,
  setCategoryDialogOpen,
  setChoice,
}: {
  type: "year" | "income" | "expense" | "budget"
  items: ChoiceTypeV2[]
  refresh: () => void
  setCategoryDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>
  setChoice?: React.Dispatch<React.SetStateAction<ChoiceTypeV2 | null>>
}) => {
  const { theme: currentTheme } = useTheme()
  const user = useUser()

  const [confirmSelection, setConfirmSelection] = useState<number | null>(null)

  const listItemColor =
    currentTheme === "light" ? lightMode.elevatedBg : darkMode.elevatedBg

  const handleDeleteItem = async () => {
    if (!user || !confirmSelection) return

    if (type === "year") {
      await deleteYearChoice({
        userId: user.id,
        rowId: confirmSelection,
      })
    } else if (type === "income") {
      await deleteIncomeCategory({
        userId: user.id,
        rowId: confirmSelection,
      })
    } else if (type === "expense") {
      await deleteExpenseCategory({
        userId: user.id,
        rowId: confirmSelection,
      })
    } else if (type === "budget") {
      await deleteBudgetCategory({
        userId: user.id,
        rowId: confirmSelection,
      })
    }
    refresh()
    setConfirmSelection(null)
  }

  const EditDeleteButton = ({ selection }: { selection: ChoiceTypeV2 }) => {
    return (
      <Stack direction={"row"} gap={2}>
        {type === "expense" && (
          <IconButton
            edge="end"
            onClick={() => {
              if (setCategoryDialogOpen && setChoice) {
                setCategoryDialogOpen(true)
                setChoice(selection)
              }
            }}
          >
            <SettingsIcon />
          </IconButton>
        )}

        <IconButton
          edge="end"
          onClick={() => {
            setConfirmSelection(selection.id)
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    )
  }

  const ConfirmCancel = () => {
    return (
      <Stack direction={"row"} gap={2}>
        <IconButton edge="end" onClick={handleDeleteItem}>
          <DeleteIcon />
        </IconButton>

        <IconButton
          edge="end"
          onClick={() => {
            setConfirmSelection(null)
          }}
        >
          <CancelIcon />
        </IconButton>
      </Stack>
    )
  }

  return (
    <List className="flex flex-col gap-2">
      {items &&
        items.map((item) => {
          return (
            <ListItem
              key={item.name}
              secondaryAction={
                confirmSelection === item.id ? (
                  <ConfirmCancel />
                ) : (
                  <EditDeleteButton selection={item} />
                )
              }
              sx={{
                backgroundColor: listItemColor,
                borderRadius: "15px",
              }}
            >
              <ListItemText primary={item.name} />
            </ListItem>
          )
        })}
    </List>
  )
}

export default EditDeleteListItem
