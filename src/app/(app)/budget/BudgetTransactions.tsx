import ListItemSwipe from "@/components/ListItemSwipe"
import LoadingCircle from "@/components/LoadingCircle"
import ShowCaseCard from "@/components/ShowCaseCard"
import { formattedStringNumber, toTimestamp } from "@/utils/helperFunctions"
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
  BudgetType,
} from "@/utils/type"
import { useTheme } from "next-themes"
import { useUser } from "@/hooks/useUser"
import { deleteTransaction } from "@/app/api/Transactions/requests"

const BudgetTransactions = ({
  transactions,
  refreshTransactions,
  budgetCategories,
  setSelectedTransaction,
  setAlertToast,
  setOpenDialog,
  isLoading,
  week,
}: {
  transactions: NewTransactionType[]
  refreshTransactions: () => Promise<void>
  budgetCategories: BudgetType[]
  setSelectedTransaction: HookSetter<NewTransactionType | null>
  setAlertToast: HookSetter<AlertToastType | undefined>
  setOpenDialog: HookSetter<boolean>
  isLoading: boolean
  week: WeekType
}) => {
  const { theme: currentTheme } = useTheme()
  const user = useUser()

  const [noteId, setNoteId] = useState<number | null>(null)

  const expenseTransactions = useMemo(() => {
    const weekStart = toTimestamp(week.start)
    const weekEnd = toTimestamp(week.end)

    return transactions.filter((entry) => {
      if (!entry.date?.day || entry.type !== "expense") return false
      const entryTime = toTimestamp(entry.date)
      return entryTime >= weekStart && entryTime <= weekEnd
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
        <LoadingCircle height={250} />
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
                  const sortedEntries = [...entries].sort(
                    (a, b) => toTimestamp(b.date) - toTimestamp(a.date),
                  )
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
                        {sortedEntries.map((entry, index) => {
                          const entryDate = `${entry.date.month} ${entry.date.day}, ${entry.date.year}`
                          const isLast = index === sortedEntries.length - 1
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
            </Stack>
          )}
        </Stack>
      )}
    </ShowCaseCard>
  )
}

export default BudgetTransactions
