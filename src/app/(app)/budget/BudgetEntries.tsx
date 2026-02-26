"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import { darkMode, lightMode } from "@/globals/colors"
import DeleteIcon from "@mui/icons-material/Delete"
import CancelIcon from "@mui/icons-material/Cancel"
import EditIcon from "@mui/icons-material/Edit"
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Typography,
  Box,
} from "@mui/material"
import { BudgetTransactionTypeV2, HookSetter } from "@/utils/type"
import { deleteBudget } from "@/app/api/Transactions/requests"
import { useUser } from "@/hooks/useUser"
import { FlexColWrapper } from "@/components/Wrappers"
import { useMemo, useState } from "react"
import { formattedStringNumber } from "@/utils/helperFunctions"

const EditDeleteButton = ({
  id,
  entry,
  setOpenEditDialog,
  setSelectedEntry,
  setNoteId,
}: {
  id: number
  entry: BudgetTransactionTypeV2
  setOpenEditDialog: HookSetter<boolean>
  setSelectedEntry: HookSetter<BudgetTransactionTypeV2 | null>
  setNoteId: HookSetter<number | null>
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

const ConfirmCancelButton = ({
  id,
  deleteEntry,
  setNoteId,
  setSelectedEntry,
}: {
  id: number
  deleteEntry: (id: number) => void
  setNoteId: HookSetter<number | null>
  setSelectedEntry: HookSetter<BudgetTransactionTypeV2 | null>
}) => {
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

const BudgetEntries = ({
  budgetTransactions,
  refreshBudgetTransactions,
  setOpenEditDialog,
  setSelectedEntry,
  currentTheme,
}: {
  budgetTransactions: BudgetTransactionTypeV2[]
  refreshBudgetTransactions: () => void
  setOpenEditDialog: HookSetter<boolean>
  setSelectedEntry: HookSetter<BudgetTransactionTypeV2 | null>
  currentTheme: string | undefined
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

  const groupedTransactions = useMemo(() => {
    return budgetTransactions.reduce(
      (acc, transaction) => {
        const category = transaction.category

        if (!acc[category]) {
          acc[category] = []
        }

        acc[category].push(transaction)

        return acc
      },
      {} as Record<string, BudgetTransactionTypeV2[]>,
    )
  }, [budgetTransactions])

  return (
    <FlexColWrapper gap={2}>
      <ShowCaseCard title={""}>
        <List className="flex flex-col gap-2" disablePadding={true}>
          {budgetTransactions.length === 0 ? (
            <Typography>The are no budget entries yet</Typography>
          ) : (
            Object.entries(groupedTransactions)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([category, entries]) => {
                const total = entries.reduce((sum, entry) => {
                  return entry.isReturn
                    ? sum - entry.amount
                    : sum + entry.amount
                }, 0)

                return (
                  <Box key={category}>
                    <Stack direction={"row"} justifyContent={"space-around"}>
                      <Typography variant="h6">{category}</Typography>
                      <Typography variant="h6">
                        {`$${formattedStringNumber(total)}`}
                      </Typography>
                    </Stack>

                    <Stack direction={"column"} spacing={1}>
                      {entries.map((entry) => {
                        return (
                          <ListItem
                            key={entry.id}
                            secondaryAction={
                              noteId === entry.id ? (
                                <ConfirmCancelButton
                                  id={entry.id}
                                  deleteEntry={deleteEntry}
                                  setNoteId={setNoteId}
                                  setSelectedEntry={setSelectedEntry}
                                />
                              ) : (
                                <EditDeleteButton
                                  id={entry.id}
                                  entry={entry}
                                  setOpenEditDialog={setOpenEditDialog}
                                  setSelectedEntry={setSelectedEntry}
                                  setNoteId={setNoteId}
                                />
                              )
                            }
                            sx={{
                              backgroundColor: listItemColor,
                              borderRadius: "15px",
                            }}
                          >
                            <ListItemText
                              primary={`$${entry.amount.toFixed(2)} - ${entry.note}`}
                              secondary={`${entry.isReturn ? "RETURNED" : ""}`}
                            />
                          </ListItem>
                        )
                      })}
                    </Stack>
                  </Box>
                )
              })
          )}
        </List>
      </ShowCaseCard>
    </FlexColWrapper>
  )
}

export default BudgetEntries
