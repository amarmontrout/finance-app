import ListItemSwipe from "@/components/ListItemSwipe"
import LoadingCircle from "@/components/LoadingCircle"
import ShowCaseCard from "@/components/ShowCaseCard"
import {
  accentColorPrimarySelected,
  negativeColor,
  neutralColor,
  positiveColor,
} from "@/globals/colors"
import { formattedStringNumber, toTimestamp } from "@/utils/helperFunctions"
import { Stack, Typography, Collapse, Box } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { TransitionGroup } from "react-transition-group"
import TransactionTypeToggle from "../../../components/TransactionTypeToggle"
import { deleteTransaction } from "@/app/api/Transactions/requests"
import { useUser } from "@/hooks/useUser"
import {
  AlertToastType,
  HookSetter,
  NewTransactionType,
  SelectedDateType,
} from "@/utils/type"
import ExpenseViewToggle from "./ExpenseViewToggle"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"

const TransactionsDisplay = ({
  transactions,
  refreshTransactions,
  type,
  setType,
  selectedDate,
  setAlertToast,
  selectedTransaction,
  setSelectedTransaction,
  isLoading,
  openDialog,
  setOpenDialog,
  currentTheme,
}: {
  transactions: NewTransactionType[]
  refreshTransactions: () => Promise<void>
  type: "income" | "expense"
  setType: HookSetter<"income" | "expense">
  selectedDate: SelectedDateType
  setAlertToast: HookSetter<AlertToastType | undefined>
  selectedTransaction: NewTransactionType | null
  setSelectedTransaction: HookSetter<NewTransactionType | null>
  isLoading: boolean
  openDialog: boolean
  setOpenDialog: HookSetter<boolean>
  currentTheme: string | undefined
}) => {
  const user = useUser()

  const [view, setView] = useState<"Credit" | "Debit" | "Both">("Debit")
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({})

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const { filteredTransactions, total } = useMemo(() => {
    const filtered = transactions.filter((t) => {
      const matchesType = t.type === type
      const matchesMonth = t.date.month === selectedDate.month
      const matchesYear = t.date.year === selectedDate.year

      const matchesView =
        type === "expense"
          ? view === "Both" ||
            (view === "Debit" && t.payment_method === "Debit") ||
            (view === "Credit" && t.payment_method === "Credit")
          : true

      return matchesType && matchesMonth && matchesYear && matchesView
    })
    const totalAmount = filtered.reduce((sum, t) => sum + t.amount, 0)
    return { filteredTransactions: filtered, total: totalAmount }
  }, [transactions, type, selectedDate, view])

  const groupedTransactions = useMemo(() => {
    return filteredTransactions.reduce<Record<string, NewTransactionType[]>>(
      (acc, transaction) => {
        const category = transaction.category

        if (!acc[category]) acc[category] = []

        acc[category].push(transaction)

        return acc
      },
      {},
    )
  }, [filteredTransactions])

  const sortedCategories = useMemo(() => {
    return Object.entries(groupedTransactions).sort(([a], [b]) =>
      a.localeCompare(b),
    )
  }, [groupedTransactions])

  const showToast = (severity: "success" | "error", message: string) =>
    setAlertToast({
      open: true,
      severity,
      message,
      onClose: () => setAlertToast(undefined),
    })

  const handleDeleteTransaction = async (rowId: number) => {
    if (!user || !rowId) return

    try {
      await deleteTransaction({ userId: user.id, rowId })
      showToast("success", "Transaction deleted successfully!")
    } catch {
      showToast("error", "Transaction could not be deleted.")
    } finally {
      refreshTransactions()
      setSelectedTransaction(null)
    }
  }

  useEffect(() => {
    setView("Debit")
  }, [type])

  return (
    <ShowCaseCard title={""}>
      <Stack className="xl:w-[50%]" spacing={2} margin={"0 auto"}>
        <Stack spacing={1}>
          <TransactionTypeToggle type={type} setType={setType} />
        </Stack>

        {isLoading ? (
          <LoadingCircle />
        ) : (
          <Stack spacing={1.5}>
            {type === "expense" && (
              <ExpenseViewToggle view={view} setView={setView} />
            )}
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h5" fontWeight={700}>
                {type === "income" ? "Income" : "Expense"}
              </Typography>

              <Typography variant="h5" fontWeight={700}>
                {`$${formattedStringNumber(total)}`}
              </Typography>
            </Stack>

            <hr
              style={{
                border: `1px solid ${accentColorPrimarySelected}`,
              }}
            />

            {filteredTransactions.length === 0 ? (
              <Typography width="100%" textAlign="center">
                {`There are no ${type} transactions`}
              </Typography>
            ) : (
              <Stack spacing={3}>
                {sortedCategories.map(([category, entries]) => {
                  const categoryTotal = entries.reduce((sum, entry) => {
                    return entry.is_return
                      ? sum - entry.amount
                      : sum + entry.amount
                  }, 0)
                  const sortedEntries = [...entries].sort(
                    (a, b) => toTimestamp(b.date) - toTimestamp(a.date),
                  )
                  const isExpanded = expandedCategories[category]
                  const visibleEntries =
                    sortedEntries.length > 2 && !isExpanded
                      ? sortedEntries.slice(0, 2)
                      : sortedEntries
                  const totalCount = sortedEntries.length
                  const visibleCount = visibleEntries.length

                  return (
                    <Stack key={category} spacing={0.5}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        color={"white"}
                        sx={{
                          mt: 1,
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor: neutralColor,
                          cursor: "pointer",
                        }}
                      >
                        <Stack
                          direction={"row"}
                          spacing={0.5}
                          alignItems={"center"}
                          onClick={() => toggleCategory(category)}
                        >
                          <Typography fontSize={17}>{category}</Typography>

                          <Typography fontSize={12} sx={{ opacity: 0.8 }}>
                            ({totalCount})
                          </Typography>

                          {sortedEntries.length > 2 &&
                            (isExpanded ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            ))}
                        </Stack>

                        <Typography>
                          ${formattedStringNumber(categoryTotal)}
                        </Typography>
                      </Stack>
                      <Stack pl={1}>
                        <TransitionGroup>
                          {visibleEntries.map((transaction, index) => {
                            const transactionDate = `${transaction.date.month} ${transaction.date.day}, ${transaction.date.year}`
                            const isLast = index === visibleEntries.length - 1

                            return (
                              <Collapse key={transaction.id}>
                                <Box mb={isLast ? 0 : 1}>
                                  <ListItemSwipe
                                    mainTitle={
                                      transaction.note === ""
                                        ? transaction.category
                                        : transaction.note
                                    }
                                    secondaryTitle={transactionDate}
                                    amount={`$${formattedStringNumber(transaction.amount)}`}
                                    amountColor={
                                      transaction.type === "income"
                                        ? positiveColor
                                        : negativeColor
                                    }
                                    buttonCondition={
                                      selectedTransaction?.id ===
                                        transaction.id && !openDialog
                                    }
                                    onDelete={() =>
                                      handleDeleteTransaction(transaction.id)
                                    }
                                    onSetDelete={() =>
                                      setSelectedTransaction(transaction)
                                    }
                                    onCancelDelete={() =>
                                      setSelectedTransaction(null)
                                    }
                                    onEdit={() => {
                                      setOpenDialog(true)
                                      setSelectedTransaction(transaction)
                                    }}
                                    currentTheme={currentTheme}
                                  />
                                </Box>
                              </Collapse>
                            )
                          })}
                        </TransitionGroup>
                      </Stack>
                    </Stack>
                  )
                })}
              </Stack>
            )}
          </Stack>
        )}
      </Stack>
    </ShowCaseCard>
  )
}

export default TransactionsDisplay
