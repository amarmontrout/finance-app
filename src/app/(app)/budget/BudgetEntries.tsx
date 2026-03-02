"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import { Box, Collapse, Stack, Typography } from "@mui/material"
import {
  AlertToastType,
  BudgetTransactionTypeV2,
  BudgetTypeV2,
  HookSetter,
} from "@/utils/type"
import { deleteBudget } from "@/app/api/Transactions/requests"
import { useUser } from "@/hooks/useUser"
import { useMemo } from "react"
import { formattedStringNumber } from "@/utils/helperFunctions"
import ListItemSwipe from "@/components/ListItemSwipe"
import LoadingCircle from "@/components/LoadingCircle"
import BudgetProgressBar from "./BudgetProgressBar"
import { TransitionGroup } from "react-transition-group"

const BudgetEntries = ({
  budgetTransactions,
  budgetCategories,
  refreshBudgetTransactions,
  setOpenEditDialog,
  setSelectedEntry,
  noteId,
  setNoteId,
  currentTheme,
  isLoading,
  setAlertToast,
}: {
  budgetTransactions: BudgetTransactionTypeV2[]
  budgetCategories: BudgetTypeV2[]
  refreshBudgetTransactions: () => void
  setOpenEditDialog: HookSetter<boolean>
  setSelectedEntry: HookSetter<BudgetTransactionTypeV2 | null>
  noteId: number | null
  setNoteId: HookSetter<number | null>
  currentTheme: string | undefined
  isLoading: boolean
  setAlertToast: HookSetter<AlertToastType | undefined>
}) => {
  const user = useUser()

  const handleDeleteEntry = async (id: number) => {
    if (!user) return
    try {
      await deleteBudget({
        userId: user?.id,
        rowId: id,
      })
      setAlertToast({
        open: true,
        onClose: () => {
          setAlertToast(undefined)
        },
        severity: "success",
        message: "Budget entry deleted successfully!",
      })
    } catch (error) {
      console.error(error)
      setAlertToast({
        open: true,
        onClose: () => {
          setAlertToast(undefined)
        },
        severity: "error",
        message: "Budget entry could not be deleted.",
      })
    } finally {
      refreshBudgetTransactions()
    }
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

  const budgetLookup = useMemo(() => {
    return budgetCategories.reduce(
      (acc, budget) => {
        acc[budget.category] = budget.amount
        return acc
      },
      {} as Record<string, number>,
    )
  }, [budgetCategories])

  return (
    <ShowCaseCard title={""}>
      {isLoading ? (
        <LoadingCircle />
      ) : (
        <Stack className="xl:w-[50%]" spacing={3} margin={"0 auto"}>
          {budgetTransactions.length === 0 ? (
            <Typography width={"100%"} textAlign={"center"}>
              The are no budget entries for this week
            </Typography>
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
                    <BudgetProgressBar
                      label={category}
                      actual={total}
                      budget={budgetLookup[category] ?? 0}
                    />

                    <TransitionGroup>
                      {entries.map((entry, index) => {
                        const entryDate = `${entry.date.month} ${entry.date.day}, ${entry.date.year}`
                        const isLast = index === entries.length - 1
                        return (
                          <Collapse key={entry.id}>
                            <Box mb={isLast ? 0 : 1}>
                              <ListItemSwipe
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
                            </Box>
                          </Collapse>
                        )
                      })}
                    </TransitionGroup>
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
