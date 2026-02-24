"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import { darkMode, lightMode } from "@/globals/colors"
import DeleteIcon from "@mui/icons-material/Delete"
import CancelIcon from "@mui/icons-material/Cancel"
import EditIcon from "@mui/icons-material/Edit"
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Typography,
} from "@mui/material"
import {
  BudgetTransactionTypeV2,
  BudgetTypeV2,
  DateType,
  HookSetter,
} from "@/utils/type"
import { deleteBudget } from "@/app/api/Transactions/requests"
import { useUser } from "@/hooks/useUser"
import BudgetEntryForm from "./BudgetEntryForm"
import { FlexColWrapper } from "@/components/Wrappers"
import { useState } from "react"

const BudgetEntries = ({
  budgetCategories,
  budgetTransactions,
  refreshBudgetTransactions,
  notes,
  setOpenEditDialog,
  setSelectedEntry,
  currentTheme,
  week,
  today,
}: {
  budgetCategories: BudgetTypeV2[]
  budgetTransactions: BudgetTransactionTypeV2[]
  refreshBudgetTransactions: () => void
  notes: string[]
  setOpenEditDialog: HookSetter<boolean>
  setSelectedEntry: HookSetter<BudgetTransactionTypeV2 | null>
  currentTheme: string | undefined
  week: "prev" | "current"
  today: DateType
}) => {
  const user = useUser()
  const [noteId, setNoteId] = useState<number | null>(null)

  const listItemColor =
    currentTheme === "light" ? lightMode.elevatedBg : darkMode.elevatedBg

  const deleteEntry = async (id: number) => {
    if (!user) return
    await deleteBudget({
      userId: user?.id,
      rowId: id,
    })
    refreshBudgetTransactions()
  }

  const EditDeleteButton = ({
    id,
    entry,
  }: {
    id: number
    entry: BudgetTransactionTypeV2
  }) => {
    return (
      <Stack direction={"row"} gap={2}>
        <IconButton
          edge="end"
          onClick={() => {
            setOpenEditDialog(true)
            setSelectedEntry(entry)
          }}
        >
          <EditIcon />
        </IconButton>

        <IconButton
          edge="end"
          onClick={() => {
            setNoteId(id)
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    )
  }

  const ConfirmCancel = ({ id }: { id: number }) => {
    return (
      <Stack direction={"row"} gap={2}>
        <IconButton
          edge="end"
          onClick={() => {
            deleteEntry(id)
            setNoteId(null)
          }}
        >
          <DeleteIcon />
        </IconButton>

        <IconButton
          edge="end"
          onClick={() => {
            setSelectedEntry(null)
            setNoteId(null)
          }}
        >
          <CancelIcon />
        </IconButton>
      </Stack>
    )
  }

  return (
    <FlexColWrapper gap={2}>
      <ShowCaseCard title={"Budget Entry Form"}>
        <BudgetEntryForm
          budgetCategories={budgetCategories}
          today={today}
          user={user}
          refreshBudgetTransactions={refreshBudgetTransactions}
          week={week}
          notes={notes}
        />
      </ShowCaseCard>

      <ShowCaseCard title={"Budget Entries"}>
        <List className="flex flex-col gap-2">
          {budgetTransactions.length === 0 ? (
            <Typography>The are no budget entries</Typography>
          ) : (
            budgetTransactions.map((entry) => {
              return (
                <ListItem
                  key={entry.id}
                  secondaryAction={
                    noteId === entry.id ? (
                      <ConfirmCancel id={entry.id} />
                    ) : (
                      <EditDeleteButton id={entry.id} entry={entry} />
                    )
                  }
                  sx={{
                    backgroundColor: listItemColor,
                    borderRadius: "15px",
                  }}
                >
                  <ListItemText
                    primary={`$${entry.amount.toFixed(2)} - ${entry.note}
                      ${entry.isReturn ? " - RETURNED" : ""}`}
                    secondary={entry.category}
                  />
                </ListItem>
              )
            })
          )}
        </List>
      </ShowCaseCard>
    </FlexColWrapper>
  )
}

export default BudgetEntries
