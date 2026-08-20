import {
  V2CategoryType,
  V2HydratedBudgetType,
  V2TransactionType,
} from "@/api/v2/models"
import { getBudgetsV2 } from "@/api/v2/requests"
import { AlertToastType, HookSetter } from "@/types/types"
import { Stack, Typography } from "@mui/material"
import { RefObject, useEffect, useMemo, useState } from "react"
import { hydrateBudgets } from "../v2/utils"

const BudgetTransactions = ({
  transactions,
  refreshTransactions,
  budgetCategories,
  // setSelectedTransaction,
  setAlertToast,
  // setOpenDialog,
  // isLoading,
  // setBudgetEditDialogOpen,
  // setConfirmEdit,
  inputRef,
  selectedDate,
}: {
  transactions: V2TransactionType[]
  refreshTransactions: () => Promise<void>
  budgetCategories: V2CategoryType[]
  // setSelectedTransaction: HookSetter<TransactionType | null>
  setAlertToast: HookSetter<AlertToastType | undefined>
  // setOpenDialog: HookSetter<boolean>
  // isLoading: boolean
  // setBudgetEditDialogOpen: HookSetter<boolean>
  // setConfirmEdit: HookSetter<BudgetType | null>
  inputRef: RefObject<HTMLInputElement | null>
  selectedDate: Date
}) => {
  const [budgets, setBudgets] = useState<V2HydratedBudgetType[]>([])

  // Get category budgets
  useEffect(() => {
    const refreshBudgets = async () => {
      if (budgetCategories.length === 0) return
      const b = await getBudgetsV2({
        filters: [
          {
            column: "deleted_at",
            operator: "eq",
            value: null,
          },
        ],
      })
      const hb = hydrateBudgets({
        categories: budgetCategories,
        budgets: b ?? [],
      })
      setBudgets(
        hb.sort((x, y) =>
          x.category_name.localeCompare(y.category_name, undefined, {
            sensitivity: "base",
          }),
        ),
      )
    }

    refreshBudgets()
  }, [budgetCategories])

  const budgetLookup = useMemo(() => {
    return budgets.reduce(
      (acc, budget) => {
        acc[budget.category_name] = budget.amount
        return acc
      },
      {} as Record<string, number>,
    )
  }, [budgetCategories])

  return (
    <Stack className="xl:w-[50%]" sx={{ margin: "0 auto" }}>
      {transactions.length === 0 ? (
        <Typography sx={{ width: "100%", textAlign: "center" }}>
          The are no expense entries for this week
        </Typography>
      ) : (
        <Stack spacing={1}>
          {/* {Object.entries(groupedTransactions)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([category, entries]) => {
              const sortedEntries = [...entries].sort(
                (a, b) =>
                  dateTypeToTimestamp(b.date) - dateTypeToTimestamp(a.date),
              )
              const actualTotal = getTransactionsTotal({
                transactions: entries,
              })
              const { earnedBudget } = getBudgetInfo({
                budget: budgetLookup[category] ?? 0,
                spent: actualTotal,
                date: today,
              })

              return (
                <Box
                  key={category}
                  bgcolor={"rgba(255,255,255,0.15)"}
                  borderRadius={5}
                  padding={2}
                >
                  <BudgetProgressBar
                    label={category}
                    // actual={actualTotal}
                    actual={0}
                    budget={budgetLookup[category] ?? 0}
                    // expected={isCurrentMonth ? earnedBudget : undefined}
                    expected={undefined}
                    // onEdit={() => {
                    //   setBudgetEditDialogOpen(true)
                    //   setConfirmEdit(budgetCategoryLookup[category])
                    //   setTimeout(() => {
                    //     inputRef.current?.focus()
                    //   }, 50)
                    // }}
                  />

                  <Stack
                    direction={"column"}
                    sx={{ paddingX: 0.5 }}
                    divider={
                      <Divider
                        orientation={"horizontal"}
                        sx={{ borderColor: "#F5F1E8" }}
                      />
                    }
                  >
                    {sortedEntries.map((entry) => {
                      const entryDate = timestampToDateString(
                        dateTypeToTimestamp(entry.date),
                      )
                      const transactionAmount = `${entry.is_return ? "+" : "-"}$${numberToString(entry.amount)}`

                      return (
                        <ListItemSwipe
                          key={entry.id}
                          mainTitle={entry.note}
                          secondaryTitle={entryDate}
                          amount={transactionAmount}
                          amountColor={"#F5F1E8"}
                          buttonCondition={noteId === entry.id}
                          onDelete={() => handleDeleteEntry(entry.id)}
                          onSetDelete={() => {
                            setNoteId(entry.id)
                          }}
                          onCancelDelete={() => {
                            setSelectedTransaction(null)
                            setNoteId(null)
                          }}
                          onEdit={() => {
                            setOpenDialog(true)
                            setSelectedTransaction(entry)
                          }}
                        />
                      )
                    })}
                  </Stack>
                </Box>
              )
            })} */}
        </Stack>
      )}
    </Stack>
  )
}

export default BudgetTransactions
