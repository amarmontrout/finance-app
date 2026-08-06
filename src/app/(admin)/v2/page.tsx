"use client"

import { TransactionType } from "@/api/transactions/models"
import { getTransactions } from "@/api/transactions/requests"
import {
  V2AccountType,
  V2CategoryType,
  V2HydratedTransactionType,
  V2MerchantType,
} from "@/api/v2/models"
import {
  getAccountsV2,
  getCategoriesV2,
  getMerchantsV2,
  getTransactionsV2,
} from "@/api/v2/requests"
import { currencyFormatter } from "@/global/formattingFunctions"
import { useUser } from "@/hooks/use-user"
import { Stack } from "@mui/material"
import { useEffect, useState } from "react"
import AddTransaction from "./forms/AddTransaction"
import { hydrateTransactions } from "./utils"

const V2Page = () => {
  const [accounts, setAccounts] = useState<V2AccountType[]>([])
  const [categories, setCategories] = useState<V2CategoryType[]>([])
  const [merchants, setMerchants] = useState<V2MerchantType[]>([])
  const [t, setT] = useState<V2HydratedTransactionType[]>([])

  const refreshAccounts = async () => {
    const a = await getAccountsV2({
      filters: [
        {
          column: "deleted_at",
          operator: "eq",
          value: null,
        },
      ],
    })
    setAccounts(
      (a ?? []).sort((x, y) =>
        x.name.localeCompare(y.name, undefined, { sensitivity: "base" }),
      ),
    )
  }

  const refreshCategories = async () => {
    const c = await getCategoriesV2({
      filters: [
        {
          column: "deleted_at",
          operator: "eq",
          value: null,
        },
      ],
    })
    setCategories(
      (c ?? []).sort((x, y) =>
        x.name.localeCompare(y.name, undefined, { sensitivity: "base" }),
      ),
    )
  }

  const refreshMerchants = async () => {
    const m = await getMerchantsV2({
      filters: [
        {
          column: "deleted_at",
          operator: "eq",
          value: null,
        },
      ],
    })
    setMerchants(
      (m ?? []).sort((x, y) =>
        x.name.localeCompare(y.name, undefined, { sensitivity: "base" }),
      ),
    )
  }

  const refreshTransactions = async () => {
    if (accounts.length == 0 || categories.length == 0 || merchants.length == 0)
      return
    const t = await getTransactionsV2({
      filters: [
        {
          column: "deleted_at",
          operator: "eq",
          value: null,
        },
      ],
    })
    const sortedTransactions = [...t!].sort((a, b) =>
      b.transaction_date.localeCompare(a.transaction_date),
    )
    const ht = hydrateTransactions({
      accounts: accounts,
      categories: categories,
      merchants: merchants,
      transactions: sortedTransactions ?? [],
    })
    setT(ht)
  }

  // Initial data fetch
  useEffect(() => {
    refreshAccounts()
    refreshCategories()
    refreshMerchants()
  }, [])

  // Fetch hydrated data (transactions)
  useEffect(() => {
    refreshTransactions()
  }, [accounts, categories, merchants])

  // ===========================================================================
  // THIS IS ONLY USED TO CONVERT OLD V1 TRANSACTIONS TO THE NEW FORMAT. CAN BE DELETED
  const [transactions, setTransactions] = useState<TransactionType[]>([])
  const [index, setIndex] = useState<number>(0)
  const user = useUser()

  useEffect(() => {
    const refreshTransactionsV1 = async () => {
      if (!user) return
      try {
        console.log("Fetching V1 Transactions...")
        const result = await getTransactions({
          userId: user.id,
          isDeleted: false,
          month: "August",
          year: 2026,
        })
        setTransactions(result ?? [])
      } catch (error) {
        console.error("Failed to fetch v1 transactions", error)
        setTransactions([])
      }
    }

    refreshTransactionsV1()
  }, [user])
  // ===========================================================================

  return (
    <Stack gap={1} divider={<hr />}>
      <AddTransaction
        accounts={accounts}
        categories={categories}
        merchants={merchants}
        v1Transaction={undefined}
        index={index}
        setIndex={setIndex}
      />

      {/* <Stack spacing={2}>
        {transactions.length && (
          <Box key={transactions[index].id}>
            <Typography>${transactions[index].amount}</Typography>
            <Typography>
              {transactions[index].date.month} {transactions[index].date.day},{" "}
              {transactions[index].date.year}
            </Typography>
            <Typography>category: {transactions[index].category}</Typography>
            <Typography>merchant: {transactions[index].note}</Typography>
            <Typography>
              payment method {transactions[index].payment_method}
            </Typography>
            <Typography>type {transactions[index].type}</Typography>
            <Typography>
              is paid {transactions[index].is_paid ? "True" : "False"}
            </Typography>
            <Typography
              variant={transactions[index].is_return ? "h5" : "body1"}
              color={transactions[index].is_return ? "red" : "inherit"}
            >
              is return {transactions[index].is_return ? "True" : "False"}
            </Typography>
          </Box>
        )}
      </Stack> */}

      {t.map((transaction) => (
        <div
          key={transaction.transaction_id}
          style={{
            border: `1px solid ${transaction.category_color!}`,
            color: transaction.category_color!,
          }}
        >
          <div>Account name: {transaction.account_name}</div>
          <div>Account type: {transaction.account_type}</div>
          <div>Category name: {transaction.category_name}</div>
          <div>Category color: {transaction.category_color}</div>
          <div>Merchant name: {transaction.merchant_name}</div>
          <div>Amount: {currencyFormatter.format(transaction.amount)}</div>
          <div>Transaction type: {transaction.transaction_type}</div>
          <div>Description: {transaction.description}</div>
          <div>Notes: {transaction.notes}</div>
          <div>Transaction date: {transaction.transaction_date}</div>
          <div>Status: {transaction.is_paid ? "Paid" : "Unpaid"}</div>
          <div>Delete date: {transaction.deleted_at}</div>
        </div>
      ))}
    </Stack>
  )
}

export default V2Page
