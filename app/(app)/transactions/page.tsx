"use client"

import { AccountTypeValue } from "@/app/(api)/accounts/models"
import {
  TransactionType,
  TransactionTypeValue,
} from "@/app/(api)/transactions/models"
import AllDialogs from "@/app/components/AllDialogs"
import Center from "@/app/components/Center"
import TransactionTypeToggle from "@/app/components/inputs/TransactionTypeToggle"
import PageContainer from "@/app/components/PageContainer"
import Section from "@/app/components/Section"
import AlertToast from "@/app/components/ui/AlertToast"
import MonthYearSelector from "@/app/components/ui/MonthYearSelector"
import Surface from "@/app/components/ui/Surface"
import { useDataContext } from "@/app/contexts/data-context"
import { useTransactionContext } from "@/app/contexts/transaction-context"
import { DEFUALT_EXPENSE_TYPE } from "@/app/data/constants"
import { CircularProgress, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import TransactionList from "./TransactionList"
import TransactionsHeader from "./TransactionsHeader"

export default function Transactions() {
  const {
    transactions,
    isTransactionsLoading,
    deleteExistingTransaction,
    setSelectedTransaction,
    alertToast,
    setOpenEditTransactionDialog,
    getReturnedAmount,
  } = useTransactionContext()
  const { categoryMap, accountMap, isDataContextLoading } = useDataContext()

  const isLoading = isTransactionsLoading || isDataContextLoading

  const [transactionType, setTransactionType] =
    useState<TransactionTypeValue>("Income")
  const [expenseType, setExpenseType] =
    useState<AccountTypeValue[]>(DEFUALT_EXPENSE_TYPE)

  const { filteredTransactions, filteredTotal } = useMemo(() => {
    const filteredTransactions: TransactionType[] = []
    let filteredTotal = 0
    transactions.forEach((t) => {
      if (t.transaction_type !== transactionType) return
      if (transactionType === "Expense") {
        const accountType = accountMap.get(t.account_id)?.type
        if (!accountType || !expenseType.includes(accountType)) return
        filteredTransactions.push(t)
        if (t.is_paid) {
          filteredTotal += t.amount - getReturnedAmount(t.transaction_id)
        }
        return
      }
      filteredTransactions.push(t)
      filteredTotal += t.amount
    })
    return { filteredTransactions, filteredTotal }
  }, [
    transactions,
    transactionType,
    expenseType,
    accountMap,
    getReturnedAmount,
  ])

  const dateGroupedTransactions = useMemo(() => {
    return filteredTransactions.reduce<Record<string, TransactionType[]>>(
      (groups, transaction) => {
        const date = transaction.transaction_date
        groups[date] ??= []
        groups[date].push(transaction)
        return groups
      },
      {},
    )
  }, [filteredTransactions])

  useEffect(() => {
    if (transactionType === "Expense") {
      setExpenseType(DEFUALT_EXPENSE_TYPE)
    }
  }, [transactionType])

  return (
    <PageContainer>
      <Section>
        <Surface>
          <MonthYearSelector showMonth={true} showYearButtons={false} />
        </Surface>
      </Section>

      <Surface>
        <Section>
          <Center>
            <TransactionTypeToggle
              transactionType={transactionType}
              setTransactionType={setTransactionType}
            />
          </Center>
        </Section>

        {isLoading ? (
          <Center>
            <CircularProgress />
          </Center>
        ) : (
          <Stack direction={"column"} spacing={1}>
            <TransactionsHeader
              filteredTotal={filteredTotal}
              transactionType={transactionType}
              expenseType={expenseType}
              setExpenseType={setExpenseType}
            />

            {!filteredTransactions.length ? (
              <Center>
                <Typography>No transactions found</Typography>
              </Center>
            ) : (
              <TransactionList
                dateGroupedTransactions={dateGroupedTransactions}
                categoryMap={categoryMap}
                deleteExistingTransaction={deleteExistingTransaction}
                setSelectedTransaction={setSelectedTransaction}
                setOpenEditTransactionDialog={setOpenEditTransactionDialog}
                getReturnedAmount={getReturnedAmount}
              />
            )}
          </Stack>
        )}
      </Surface>

      <AlertToast alertToast={alertToast} />
      <AllDialogs />
    </PageContainer>
  )
}
