import ListItemSwipe from "@/components/ListItemSwipe"
import LoadingCircle from "@/components/LoadingCircle"
import ShowCaseCard from "@/components/ShowCaseCard"
import { accentColorPrimary } from "@/globals/colors"
import { formattedStringNumber } from "@/utils/helperFunctions"
import { Stack, Typography, Collapse, Box } from "@mui/material"
import { useMemo, useState } from "react"
import { TransitionGroup } from "react-transition-group"
import BudgetProgressBar from "./BudgetProgressBar"
import {
  NewTransactionType,
  DateType,
  AlertToastType,
  HookSetter,
  WeekType,
} from "@/utils/type"
import { useCategoryContext } from "@/contexts/categories-context"
import { useTheme } from "next-themes"
import { useUser } from "@/hooks/useUser"
import { deleteTransaction } from "@/app/api/Transactions/requests"

const BudgetTransactions = ({
  transactions,
  refreshTransactions,
  setSelectedTransaction,
  setAlertToast,
  setOpenDialog,
  isLoading,
  week,
}: {
  transactions: NewTransactionType[]
  refreshTransactions: () => Promise<void>
  setSelectedTransaction: HookSetter<NewTransactionType | null>
  setAlertToast: HookSetter<AlertToastType | undefined>
  setOpenDialog: HookSetter<boolean>
  isLoading: boolean
  week: WeekType
}) => {
  const { budgetCategories } = useCategoryContext()
  const { theme: currentTheme } = useTheme()
  const user = useUser()

  const [noteId, setNoteId] = useState<number | null>(null)

  const expenseTransactions = useMemo(() => {
    const toDate = (date: DateType) => {
      const monthIndex = new Date(`${date.month} 1, ${date.year}`).getMonth()
      return new Date(date.year, monthIndex, date.day)
    }

    const weekStart = toDate(week.start)
    const weekEnd = toDate(week.end)

    return transactions.filter((entry) => {
      if (!entry.date?.day || entry.type !== "expense") return false

      const entryDate = toDate(entry.date)

      return entryDate >= weekStart && entryDate <= weekEnd
    })
  }, [transactions, week.start, week.end])

  const groupedTransactions = useMemo(() => {
    const allowedCategories = new Set(budgetCategories.map((c) => c.category))

    return expenseTransactions.reduce<Record<string, NewTransactionType[]>>(
      (acc, transaction) => {
        if (!allowedCategories.has(transaction.category)) return acc

        const category = transaction.category

        if (!acc[category]) {
          acc[category] = []
        }

        acc[category].push(transaction)

        return acc
      },
      {},
    )
  }, [expenseTransactions, budgetCategories])

  const budgetLookup = useMemo(() => {
    return budgetCategories.reduce(
      (acc, budget) => {
        acc[budget.category] = budget.amount
        return acc
      },
      {} as Record<string, number>,
    )
  }, [budgetCategories])

  const budgetTotal = budgetCategories.reduce((sum, c) => sum + c.amount, 0)
  const actualTotal = useMemo(() => {
    const allowedCategories = new Set(budgetCategories.map((c) => c.category))

    return expenseTransactions
      .filter((entry) => allowedCategories.has(entry.category))
      .reduce((sum, t) => sum + (t.is_return ? -t.amount : t.amount), 0)
  }, [expenseTransactions, budgetCategories])
  const netTotal = budgetTotal - actualTotal

  const handleDeleteEntry = async (id: number) => {
    if (!user) return
    try {
      await deleteTransaction({
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
      await refreshTransactions()
    }
  }

  return (
    <ShowCaseCard title={""}>
      {isLoading ? (
        <LoadingCircle />
      ) : (
        <Stack className="xl:w-[50%]" spacing={3} margin={"0 auto"}>
          {expenseTransactions.length === 0 ? (
            <Typography width={"100%"} textAlign={"center"}>
              The are no expense entries for this week
            </Typography>
          ) : (
            <Stack spacing={5}>
              {Object.entries(groupedTransactions)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([category, entries]) => {
                  const total = entries.reduce((sum, entry) => {
                    return entry.is_return
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
                                  amount={`${entry.is_return ? "-" : ""}$${formattedStringNumber(entry.amount)}`}
                                  amountColor={
                                    entry.is_return ? "error.main" : "inherit"
                                  }
                                  buttonCondition={noteId === entry.id}
                                  onDelete={async () => {
                                    handleDeleteEntry(entry.id)
                                  }}
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
                                  currentTheme={currentTheme}
                                />
                              </Box>
                            </Collapse>
                          )
                        })}
                      </TransitionGroup>
                    </Stack>
                  )
                })}

              <Stack spacing={1.5}>
                <hr style={{ border: `1px solid ${accentColorPrimary}` }} />

                <BudgetProgressBar
                  label={"Week Total"}
                  actual={actualTotal}
                  budget={budgetTotal}
                />

                {expenseTransactions.length !== 0 && (
                  <Typography variant={"h6"} textAlign={"left"}>
                    {`${netTotal < 0 ? "Overspending" : "Saving"}
                    $${formattedStringNumber(Math.abs(netTotal))} for the week`}
                  </Typography>
                )}
              </Stack>
            </Stack>
          )}
        </Stack>
      )}
    </ShowCaseCard>
  )
}

export default BudgetTransactions
