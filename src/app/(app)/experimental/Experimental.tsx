"use client"

import AddDataButton from "@/components/AddDataButton"
import { Box, Collapse, Stack, Typography } from "@mui/material"
import { useMemo, useRef, useState } from "react"
import {
  AlertToastType,
  NewTransactionType,
  SelectedDateType,
} from "@/utils/type"
import AlertToast from "@/components/AlertToast"
import { useCategoryContext } from "@/contexts/categories-context"
import { useTransactionContext } from "@/contexts/transactions-context"
import MonthYearSelector from "@/components/MonthYearSelector"
import {
  formattedStringNumber,
  getCurrentDateInfo,
} from "@/utils/helperFunctions"
import { useTheme } from "next-themes"
import ShowCaseCard from "@/components/ShowCaseCard"
import { TransitionGroup } from "react-transition-group"
import ListItemSwipe from "@/components/ListItemSwipe"
import { accentColorPrimarySelected } from "@/globals/colors"
import { deleteTransaction } from "@/app/api/Transactions/requests"
import { useUser } from "@/hooks/useUser"
import AddEditDialog from "./AddEditDialog"
import TransactionTypeToggle from "./TransactionTypeToggle"
import { getTotalsForMonth, getTotalsForMonthNetCash } from "./functions"
import LoadingCircle from "@/components/LoadingCircle"

const Experimental = () => {
  const { transactions, refreshTransactions, isLoading } =
    useTransactionContext()
  const { incomeCategoriesV2, expenseCategoriesV2 } = useCategoryContext()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [alertToast, setAlertToast] = useState<AlertToastType>()
  //////////////////////////////////////////////////////////////////////////////
  const { theme: currentTheme } = useTheme()
  const { currentYear, currentMonth } = getCurrentDateInfo()
  const user = useUser()
  const CURRENT_DATE = {
    month: currentMonth,
    year: currentYear,
  }
  const [selectedDate, setSelectedDate] =
    useState<SelectedDateType>(CURRENT_DATE)
  const [selectedTransaction, setSelectedTransaction] =
    useState<NewTransactionType | null>(null)
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

  const { incomeTotalMonthNet, expenseTotalMonthNet } =
    getTotalsForMonthNetCash(
      selectedDate.year,
      selectedDate.month,
      transactions,
    )

  const { incomeTotalMonth, expenseTotalMonth } = getTotalsForMonth(
    selectedDate.year,
    selectedDate.month,
    transactions,
  )

  const visibleTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) =>
      a.category.localeCompare(b.category, undefined, {
        sensitivity: "base",
      }),
    )
  }, [filteredTransactions])

  const allNotes = useMemo(() => {
    return [
      ...new Set(
        transactions
          .filter((e) => e.type === type)
          .filter((e) => e.note !== "")
          .map((e) => e.note),
      ),
    ]
  }, [transactions])

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

  const resetSelectedDate = () => {
    setSelectedDate(CURRENT_DATE)
  }
  //////////////////////////////////////////////////////////////////////////////

  return (
    <Stack spacing={1.5}>
      <MonthYearSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        resetSelectedDate={resetSelectedDate}
        showMonth={true}
      />

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
                          {/* Revisit the onDelete, onSetDelete, onCancelDelete, and onEdit functions for new transaction type */}
                          <ListItemSwipe
                            mainTitle={transaction.category}
                            secondaryTitle={transaction.is_paid ? "Paid" : ""}
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

      <AddEditDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        setAlertToast={setAlertToast}
        incomeCategoriesV2={incomeCategoriesV2}
        expenseCategoriesV2={expenseCategoriesV2}
        inputRef={inputRef}
        allNotes={allNotes}
        refreshTransactions={refreshTransactions}
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={setSelectedTransaction}
      />

      <AlertToast alertToast={alertToast} />

      <AddDataButton
        action={() => {
          setOpenDialog(true)
          setTimeout(() => {
            inputRef.current?.focus()
          }, 50)
        }}
      />
    </Stack>
  )
}

export default Experimental
