"use client"

import { darkMode, lightMode } from "@/globals/colors"
import { Stack, IconButton, List, ListItem, ListItemText } from "@mui/material"
import { useTheme } from "next-themes"
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from "react";
import { saveChoices } from "@/utils/choiceStorage";
import { EXPENSE_CATEGORIES_KEY } from "@/globals/globals";
import { Choice } from "@/contexts/categories-context";

const EditDeleteListItem = (props: {
    items: Choice[]
    storageKey: string
    refresh: () => void
    setCategoryDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>
    setChoice?: React.Dispatch<React.SetStateAction<Choice>>
  }) => {

  const { 
    items,
    storageKey,
    refresh,
    setCategoryDialogOpen,
    setChoice
  } = props
    
  const [confirmSelection, setConfirmSelection] = useState<string | null>(null)

  const { theme: currentTheme } = useTheme()
  const listItemColor = currentTheme === "light" ?
    lightMode.elevatedBg 
    : darkMode.elevatedBg

  const handleDeleteItem = () => {
    const newItemList = items.filter(
      (selection) => {return selection.name !== confirmSelection}
    )
    saveChoices({key: storageKey, choiceArray: newItemList})
    refresh()
  }

  const EditDeleteButton = (props: {
    selection: Choice
  }) => {

    const { selection } = props

    return (
      <Stack direction={"row"} gap={2}>
        {storageKey === EXPENSE_CATEGORIES_KEY &&
          <IconButton 
            edge="end"
            onClick={
              () => {
                if (setCategoryDialogOpen && setChoice) {
                  setCategoryDialogOpen(true)
                  setChoice(selection)
                }
              }
            }
          >
            <SettingsIcon/>
          </IconButton>
        }

        <IconButton 
          edge="end"
          onClick={
            () => {
              setConfirmSelection(selection.name)
            }
          }
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    )
  }

  const ConfirmCancel = () => {
    return (
      <Stack direction={"row"} gap={2}>
        <IconButton 
          edge="end"
          onClick={
            () => {
              handleDeleteItem()
            }
          }
        >
          <DeleteIcon/>
        </IconButton>

        <IconButton 
          edge="end"
          onClick={
            () => {
              setConfirmSelection(null)
            }
          }
        >
          <CancelIcon/>
        </IconButton>
      </Stack>
    )
  }

  return (
    <List className="flex flex-col gap-2">
      { items &&
        (items).map((item) => {                 
          return (
            <ListItem
              key={item.name} 
              secondaryAction={
                confirmSelection === item.name
                ? <ConfirmCancel/> 
                : <EditDeleteButton selection={item}/>
              }
              sx={{ 
                backgroundColor: listItemColor,
                borderRadius: "10px"
              }}
            >
              <ListItemText primary={item.name}/>
            </ListItem>
          )
        })
      }
    </List>
  )
}

export default EditDeleteListItem