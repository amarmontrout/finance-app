import ListItemSwipe from "@/components/ListItemSwipe"
import LoadingCircle from "@/components/LoadingCircle"
import ShowCaseCard from "@/components/ShowCaseCard"
import { accentColorPrimarySelected } from "@/globals/colors"
import { formattedStringNumber } from "@/utils/helperFunctions"
import { Stack, Typography, Collapse, Box } from "@mui/material"
import { useMemo, useState } from "react"
import { TransitionGroup } from "react-transition-group"
import TransactionTypeToggle from "./TransactionTypeToggle"
import { deleteTransaction } from "@/app/api/Transactions/requests"
import { useUser } from "@/hooks/useUser"
import {
  AlertToastType,
  HookSetter,
  NewTransactionType,
  SelectedDateType,
} from "@/utils/type"

const TransactionsDisplay = ({
  transactions,
  refreshTransactions,
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

  const [type, setType] = useState<"income" | "expense">("income")

  const filteredTransactions = useMemo(() => {
    return transactions.filter(
      (t) =>
        t.type === type &&
        t.date.month === selectedDate.month &&
        t.date.year === selectedDate.year,
    )
  }, [transactions, type, selectedDate])

  const total = useMemo(() => {
    return filteredTransactions.reduce((sum, t) => sum + t.amount, 0)
  }, [filteredTransactions])

  const visibleTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) =>
      a.category.localeCompare(b.category, undefined, {
        sensitivity: "base",
      }),
    )
  }, [filteredTransactions])

  const handleDeleteTransaction = async (rowId: number) => {
    if (!user || !rowId) return

    try {
      await deleteTransaction({
        userId: user.id,
        rowId: rowId,
      })
      setAlertToast({
        open: true,
        onClose: () => {
          setAlertToast(undefined)
        },
        severity: "success",
        message: "Transaction deleted successfully!",
      })
    } catch (error) {
      console.error(error)
      setAlertToast({
        open: true,
        onClose: () => {
          setAlertToast(undefined)
        },
        severity: "error",
        message: "Transaction could not be deleted.",
      })
    } finally {
      refreshTransactions()
      setSelectedTransaction(null)
    }
  }

  return (
    <ShowCaseCard title={""}>
      <Stack className="xl:w-[50%]" spacing={2} margin={"0 auto"}>
        <TransactionTypeToggle type={type} setType={setType} />

        {isLoading ? (
          <LoadingCircle />
        ) : (
          <Stack spacing={1.5}>
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
            {visibleTransactions.length === 0 ? (
              <Typography width="100%" textAlign="center">
                {`There are no ${type} transactions`}
              </Typography>
            ) : (
              <TransitionGroup>
                {visibleTransactions.map((transaction, index) => {
                  const isLast = index === visibleTransactions.length - 1
                  return (
                    <Collapse key={transaction.id}>
                      <Box mb={isLast ? 0 : 1}>
                        <ListItemSwipe
                          mainTitle={transaction.category}
                          secondaryTitle={transaction.note}
                          amount={`$${formattedStringNumber(transaction.amount)}`}
                          amountColor={
                            transaction.type === "income"
                              ? "success.main"
                              : "error.main"
                          }
                          buttonCondition={
                            selectedTransaction?.id === transaction.id &&
                            !openDialog
                          }
                          onDelete={async () => {
                            handleDeleteTransaction(transaction.id)
                          }}
                          onSetDelete={() => {
                            setSelectedTransaction(transaction)
                          }}
                          onCancelDelete={() => {
                            setSelectedTransaction(null)
                          }}
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
            )}
          </Stack>
        )}
      </Stack>
    </ShowCaseCard>
  )
}

export default TransactionsDisplay
