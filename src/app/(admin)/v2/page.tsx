"use client"

import {
  V2AccountType,
  V2BudgetType,
  V2CategoryType,
  V2HydratedTransactionType,
  V2MerchantType,
} from "@/api/v2/models"
import {
  getAccountsV2,
  getBudgetsV2,
  getCategoriesV2,
  getMerchantsV2,
  getTransactionsV2,
} from "@/api/v2/requests"
import { Stack } from "@mui/material"
import { useEffect, useState } from "react"
import AddAccount from "./AddAccount"
import AddCategory from "./AddCategory"
import AddMerchant from "./AddMerchant"
import AddTransaction from "./AddTransaction"
import { hydrateTransactions } from "./utils"

const V2Page = () => {
  const [account, setAccounts] = useState<V2AccountType[]>([])
  const [budget, setBudget] = useState<V2BudgetType[]>([])
  const [category, setCategory] = useState<V2CategoryType[]>([])
  const [merchant, setMerchant] = useState<V2MerchantType[]>([])
  const [t, setT] = useState<V2HydratedTransactionType[]>([])

  useEffect(() => {
    async function fetchAccounts() {
      const a = await getAccountsV2({})
      const b = await getBudgetsV2({})
      const c = await getCategoriesV2({})
      const m = await getMerchantsV2({})
      const t = await getTransactionsV2({})

      const asdf = hydrateTransactions({
        accounts: a!,
        categories: c!,
        merchants: m!,
        transactions: t!,
      })

      setT(asdf)
      setAccounts(a ?? [])
      setBudget(b ?? [])
      setCategory(c ?? [])
      setMerchant(m ?? [])
    }

    fetchAccounts()
  }, [])

  return (
    <Stack gap={1} divider={<hr />}>
      <AddAccount />
      <AddCategory />
      <AddMerchant categories={category} />
      <AddTransaction
        accounts={account}
        categories={category}
        merchants={merchant}
      />

      {t.map((transaction) => (
        <div
          key={transaction.transaction_id}
          style={{ border: "1px solid green" }}
        >
          <div>Transaction ID: {transaction.transaction_id}</div>
          <div>Account name: {transaction.account_name}</div>
          <div>Account type: {transaction.account_type}</div>
          <div>Category name: {transaction.category_name}</div>
          <div>Category color: {transaction.category_color}</div>
          <div>Merchant name: {transaction.merchant_name}</div>
          <div>Amount: {transaction.amount}</div>
          <div>Transaction type: {transaction.transaction_type}</div>
          <div>Description: {transaction.description}</div>
          <div>Notes: {transaction.notes}</div>
          <div>Transaction date: {transaction.transaction_date}</div>
          <div>Status: {transaction.status}</div>
          <div>Is recurring: {String(transaction.is_recurring)}</div>
          <div>Delete date: {transaction.deleted_at}</div>
        </div>
      ))}
    </Stack>
  )
}

export default V2Page
