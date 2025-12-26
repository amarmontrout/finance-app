"use client"

import { darkMode, lightMode } from "@/globals/colors"
import { Stack, IconButton, List, ListItem, ListItemText } from "@mui/material"
import { useTheme } from "next-themes"
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from "react";
import { saveChoices } from "@/utils/choiceStorage";

const EditDeleteListItem = (props: {
    items: string[]
    storageKey: string
    refresh: () => void
    setOpenEditDialog?: React.Dispatch<React.SetStateAction<boolean>>
  }) => {

  const { 
    items,
    storageKey,
    refresh,
    setOpenEditDialog 
  } = props
    
  const [confirmSelection, setConfirmSelection] = useState<string | null>(null)

  const { theme: currentTheme } = useTheme()
  const listItemColor = currentTheme === "light" ?
    lightMode.elevatedBg 
    : darkMode.elevatedBg

  const handleDeleteItem = () => {
    const newItemList = items.filter(
      (selection) => {return selection !== confirmSelection}
    )
    saveChoices({key: storageKey, choiceArray: newItemList})
    refresh()
  }

  const EditDeleteButton = (props: {
    selection: string
  }) => {

    const { selection } = props

    return (
      <Stack direction={"row"} gap={2}>
        <IconButton 
          edge="end"
          onClick={
            () => {
              if (setOpenEditDialog) setOpenEditDialog(true)
            }
          }
        >
          <EditIcon/>
        </IconButton>

        <IconButton 
          edge="end"
          onClick={
            () => {
              setConfirmSelection(selection)
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
              key={item} 
              secondaryAction={
                confirmSelection === item
                ? <ConfirmCancel/> 
                : <EditDeleteButton selection={item}/>
              }
              sx={{ 
                backgroundColor: listItemColor,
                borderRadius: "10px"
              }}
            >
              <ListItemText primary={item}/>
            </ListItem>
          )
        })
      }
    </List>
  )
}

export default EditDeleteListItem