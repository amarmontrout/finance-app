"use client"

import { useDataContext } from "@/contexts/data-context"
import AddDataButton from "@/global/components/AddDataButton"
import AddEditDialog from "@/global/components/AddEditDialog"
import AlertToast from "@/global/components/AlertToast"
import ListItemSwipe from "@/global/components/ListItemSwipe"
import MonthYearSelector from "@/global/components/MonthYearSelector"
import { currencyFormatter } from "@/global/formattingFunctions"
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined"
import { Divider, Stack, Typography } from "@mui/material"
import { useRef, useState } from "react"
import TransactionExpenseViewToggle from "../transactions/_components/TransactionExpenseViewToggle"
import TransactionTypeToggle from "../transactions/_components/TransactionTypeToggle"
import TransactionCategoryHeader from "../transactions/TransactionCategoryHeader"
import AppCard from "./components/AppCard"
import { useTransactionContext } from "./TransactionsContext"

const V2Transactions = () => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const { merchantMap, categoryMap } = useDataContext()
  const {
    displayType,
    expenseView,
    setExpenseView,
    selectedTransaction,
    setSelectedTransaction,
    alertToast,
    setAlertToast,
    isLoading,
    totalAmount,
    typeFilteredTransactions,
    byDateTransactions,
    deleteTransaction,
  } = useTransactionContext()

  const [openDialog, setOpenDialog] = useState<boolean>(false)

  return (
    <Stack spacing={2}>
      <MonthYearSelector showMonth={true} showYearButtons={false} />

      <TransactionTypeToggle />

      <AppCard>
        <Stack spacing={1}>
          <Stack
            direction={"row"}
            sx={{
              minHeight: 40,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant={"h5"}
              sx={{
                fontWeight: 700,
                color: "#102A1B",
                width: "100%",
              }}
            >
              {isLoading
                ? currencyFormatter.format(0)
                : currencyFormatter.format(totalAmount)}
            </Typography>

            {displayType === "Expense" && (
              <TransactionExpenseViewToggle
                expenseView={expenseView}
                setExpenseView={setExpenseView}
              />
            )}
          </Stack>

          {typeFilteredTransactions.length === 0 ? (
            <Typography sx={{ width: "100%", textAlign: "center" }}>
              {`There are no ${displayType} transactions`}
            </Typography>
          ) : (
            <Stack direction={"column"}>
              {byDateTransactions.map(([date, transactions]) => {
                const sortedTransactions = [...transactions].sort((a, b) => {
                  const merchantA = merchantMap.get(a.merchant_id!)?.name ?? ""
                  const merchantB = merchantMap.get(b.merchant_id!)?.name ?? ""

                  return merchantA.localeCompare(merchantB)
                })

                if (isLoading) return

                return (
                  <Stack key={date} direction={"column"} spacing={0.5}>
                    <TransactionCategoryHeader
                      transactions={transactions}
                      date={date}
                    />

                    <Stack
                      divider={
                        <Divider
                          orientation={"horizontal"}
                          sx={{ borderColor: "#F5F1E8" }}
                        />
                      }
                    >
                      {sortedTransactions.map((transaction, index) => {
                        const mainTitle =
                          merchantMap.get(transaction.merchant_id!)?.name ??
                          "No Merchant"
                        const transactionAmount = currencyFormatter.format(
                          transaction.amount,
                        )
                        const buttonCondition = false

                        return (
                          <ListItemSwipe
                            key={transaction.transaction_id}
                            icon={
                              transaction.transaction_type === "Expense" &&
                              categoryMap.get(transaction.category_id!)
                                ?.default_transaction_type !== "Return" &&
                              !transaction.is_paid && (
                                <WarningAmberOutlinedIcon />
                              )
                            }
                            mainTitle={mainTitle}
                            secondaryTitle={
                              categoryMap.get(transaction.category_id!)?.name ??
                              "No Category"
                            }
                            secondaryTitleColor={
                              categoryMap.get(transaction.category_id!)?.color
                            }
                            amount={transactionAmount}
                            amountColor={"#F5F1E8"}
                            buttonCondition={buttonCondition}
                            onDelete={() => deleteTransaction(transaction)}
                            onSetDelete={() =>
                              setSelectedTransaction(transaction)
                            }
                            onCancelDelete={() => setSelectedTransaction(null)}
                            onEdit={() => {
                              setOpenDialog(true)
                              setSelectedTransaction(transaction)
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
      </AppCard>

      <AddEditDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        setAlertToast={setAlertToast}
        inputRef={inputRef}
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={setSelectedTransaction}
      />

      <AddDataButton
        action={() => {
          setOpenDialog(true)
          setTimeout(() => {
            inputRef.current?.focus()
          }, 50)
        }}
      />

      <AlertToast alertToast={alertToast} />
    </Stack>
  )
}

export default V2Transactions
