"use client"

import AddDataButton from "@/components/AddDataButton"
import {
  Box,
  Collapse,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material"
import { useMemo, useRef, useState } from "react"
import AddDialog from "./AddDialog"
import {
  AlertToastType,
  SelectedDateType,
  SelectedTransactionType,
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
    useState<SelectedTransactionType | null>(null)
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
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

  const handleDeleteTransaction = async (
    id: number,
    type: "income" | "expense",
  ) => {
    if (!user || !selectedTransaction) return

    try {
      await deleteTransaction({
        userId: user.id,
        rowId: selectedTransaction.id,
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

  const handleSelectType = (
    event: React.MouseEvent<HTMLElement>,
    newType: "income" | "expense" | null,
  ) => {
    if (newType !== null) {
      setType(newType)
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

      <ShowCaseCard title={"New Transactions table"}>
        <Stack className="xl:w-[50%]" spacing={2} margin={"0 auto"}>
          <ToggleButtonGroup
            value={type}
            exclusive
            size={"small"}
            onChange={handleSelectType}
            sx={{
              width: "100%",
              justifyContent: "center",
              gap: 3,
              "& .MuiToggleButton-root": {
                borderRadius: "15px",
                border: "1px solid",
                px: 3,
                textTransform: "none",
              },
              "& .MuiToggleButtonGroup-grouped": {
                margin: 0,
                border: "1px solid",
                "&:not(:first-of-type)": {
                  borderLeft: "1px solid",
                },
              },
            }}
          >
            <ToggleButton value={"income"} color={"success"}>
              Income
            </ToggleButton>

            <ToggleButton value={"expense"} color={"error"}>
              Expense
            </ToggleButton>
          </ToggleButtonGroup>
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
                          secondaryTitle={transaction.is_paid ? "Paid" : ""}
                          amount={`$${formattedStringNumber(transaction.amount)}`}
                          amountColor={
                            transaction.type === "income"
                              ? "success.main"
                              : "error.main"
                          }
                          buttonCondition={
                            selectedTransaction?.id === transaction.id &&
                            !openEditDialog
                          }
                          onDelete={async () => {
                            handleDeleteTransaction(transaction.id, type)
                          }}
                          onSetDelete={() => {
                            setSelectedTransaction({
                              id: transaction.id,
                              type: type,
                            })
                          }}
                          onCancelDelete={() => {
                            setSelectedTransaction(null)
                          }}
                          onEdit={() => {
                            setOpenEditDialog(true)
                            setSelectedTransaction({
                              id: transaction.id,
                              type: type,
                            })
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
        </Stack>
      </ShowCaseCard>

      <AddDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        setAlertToast={setAlertToast}
        incomeCategoriesV2={incomeCategoriesV2}
        expenseCategoriesV2={expenseCategoriesV2}
        inputRef={inputRef}
        transactions={transactions}
        refreshTransactions={refreshTransactions}
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
