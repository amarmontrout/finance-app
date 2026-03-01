"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import { Stack, Typography, Box } from "@mui/material"
import { BudgetTransactionTypeV2, HookSetter } from "@/utils/type"
import { deleteBudget } from "@/app/api/Transactions/requests"
import { useUser } from "@/hooks/useUser"
import { useMemo } from "react"
import { formattedStringNumber } from "@/utils/helperFunctions"
import ListItemSwipe from "@/components/ListItemSwipe"
import LoadingCircle from "@/components/LoadingCircle"
import { accentColorPrimarySelected } from "@/globals/colors"

const BudgetEntries = ({
  budgetTransactions,
  refreshBudgetTransactions,
  setOpenEditDialog,
  setSelectedEntry,
  noteId,
  setNoteId,
  currentTheme,
  isLoading,
}: {
  budgetTransactions: BudgetTransactionTypeV2[]
  refreshBudgetTransactions: () => void
  setOpenEditDialog: HookSetter<boolean>
  setSelectedEntry: HookSetter<BudgetTransactionTypeV2 | null>
  noteId: number | null
  setNoteId: HookSetter<number | null>
  currentTheme: string | undefined
  isLoading: boolean
}) => {
  const user = useUser()

  const handleDeleteEntry = async (id: number) => {
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
    <ShowCaseCard title={""}>
      {isLoading ? (
        <LoadingCircle />
      ) : (
        <Stack spacing={2.5}>
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
                  <Stack key={category} spacing={0.5}>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Typography variant={"h5"} fontWeight={700}>
                        {category}
                      </Typography>
                      <Typography variant={"h5"} fontWeight={700}>
                        {`$${formattedStringNumber(total)}`}
                      </Typography>
                    </Stack>
                    <hr
                      style={{
                        border: `1px solid ${accentColorPrimarySelected}`,
                      }}
                    />
                    <Stack direction={"column"} spacing={1}>
                      {entries.map((entry) => {
                        const entryDate = `${entry.date.month} ${entry.date.day}, ${entry.date.year}`

                        return (
                          <ListItemSwipe
                            key={entry.id}
                            mainTitle={entry.note}
                            secondaryTitle={entryDate}
                            amount={`${entry.isReturn ? "-" : ""}$${formattedStringNumber(entry.amount)}`}
                            amountColor={
                              entry.isReturn ? "error.main" : "inherit"
                            }
                            buttonCondition={noteId === entry.id}
                            onDelete={async () => {
                              handleDeleteEntry(entry.id)
                            }}
                            onSetDelete={() => {
                              setNoteId(entry.id)
                            }}
                            onCancelDelete={() => {
                              setSelectedEntry(null)
                              setNoteId(null)
                            }}
                            onEdit={() => {
                              setOpenEditDialog(true)
                              setSelectedEntry(entry)
                            }}
                            currentTheme={currentTheme}
                          />
                        )
                      })}
                    </Stack>
                  </Stack>
                )
              })
          )}
        </Stack>
      )}
    </ShowCaseCard>
  )
}

export default BudgetEntries
