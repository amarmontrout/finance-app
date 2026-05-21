import { BudgetType } from "@/api/choices/models"
import { TransactionType } from "@/api/transactions/models"
import { deleteTransaction } from "@/api/transactions/requests"
import { negativeColor, neutralColor, positiveColor } from "@/global/colors"
import ListItemSwipe from "@/global/components/ListItemSwipe"
import LoadingCircle from "@/global/components/LoadingCircle"
import { getTransactionsTotal } from "@/global/dataFunctions"
import {
  dateTypeToTimestamp,
  numberToString,
  timestampToDateString,
} from "@/global/formattingFunctions"
import { useUser } from "@/hooks/use-user"
import { AlertToastType, HookSetter } from "@/types/types"
import { Divider, Stack, Typography } from "@mui/material"
import { RefObject, useMemo, useState } from "react"
import BudgetProgressBar from "../(home)/_components/ProgressBar"

const BudgetTransactions = ({
  transactions,
  refreshTransactions,
  budgetCategories,
  setSelectedTransaction,
  setAlertToast,
  setOpenDialog,
  isLoading,
  setBudgetEditDialogOpen,
  setConfirmEdit,
  inputRef,
}: {
  transactions: TransactionType[]
  refreshTransactions: () => Promise<void>
  budgetCategories: BudgetType[]
  setSelectedTransaction: HookSetter<TransactionType | null>
  setAlertToast: HookSetter<AlertToastType | undefined>
  setOpenDialog: HookSetter<boolean>
  isLoading: boolean
  setBudgetEditDialogOpen: HookSetter<boolean>
  setConfirmEdit: HookSetter<BudgetType | null>
  inputRef: RefObject<HTMLInputElement | null>
}) => {
  const user = useUser()

  const [noteId, setNoteId] = useState<number | null>(null)

  const groupedTransactions = useMemo(() => {
    const allowedCategories = new Set(budgetCategories.map((c) => c.category))

    return transactions.reduce<Record<string, TransactionType[]>>(
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
  }, [transactions, budgetCategories])

  const budgetLookup = useMemo(() => {
    return budgetCategories.reduce(
      (acc, budget) => {
        acc[budget.category] = budget.amount
        return acc
      },
      {} as Record<string, number>,
    )
  }, [budgetCategories])

  const budgetCategoryLookup = useMemo(() => {
    return budgetCategories.reduce(
      (acc, budget) => {
        acc[budget.category] = budget
        return acc
      },
      {} as Record<string, BudgetType>,
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
    <Stack className="xl:w-[50%]" sx={{ margin: "0 auto" }}>
      {isLoading ? (
        <LoadingCircle height={75} />
      ) : transactions.length === 0 ? (
        <Typography sx={{ width: "100%", textAlign: "center" }}>
          The are no expense entries for this week
        </Typography>
      ) : (
        <Stack spacing={1}>
          {Object.entries(groupedTransactions)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([category, entries]) => {
              const sortedEntries = [...entries].sort(
                (a, b) =>
                  dateTypeToTimestamp(b.date) - dateTypeToTimestamp(a.date),
              )
              const total = getTransactionsTotal({ transactions: entries })

              return (
                <Stack key={category} direction={"column"}>
                  <BudgetProgressBar
                    label={category}
                    actual={total}
                    budget={budgetLookup[category] ?? 0}
                    onEdit={() => {
                      setBudgetEditDialogOpen(true)
                      setConfirmEdit(budgetCategoryLookup[category])
                      setTimeout(() => {
                        inputRef.current?.focus()
                      }, 50)
                    }}
                  />

                  <Stack
                    direction={"column"}
                    sx={{ paddingX: 0.5 }}
                    divider={
                      <Divider
                        orientation={"horizontal"}
                        sx={{ borderColor: neutralColor.bg }}
                      />
                    }
                  >
                    {sortedEntries.map((entry) => {
                      const entryDate = timestampToDateString(
                        dateTypeToTimestamp(entry.date),
                      )
                      const transactionAmount = `${entry.is_return ? "+" : "-"}$${numberToString(entry.amount)}`
                      const amountColor = entry.is_return
                        ? positiveColor.color
                        : negativeColor.color
                      return (
                        <ListItemSwipe
                          key={entry.id}
                          mainTitle={entry.note}
                          secondaryTitle={entryDate}
                          amount={transactionAmount}
                          amountColor={amountColor}
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
                </Stack>
              )
            })}
        </Stack>
      )}
    </Stack>
  )
}

export default BudgetTransactions
