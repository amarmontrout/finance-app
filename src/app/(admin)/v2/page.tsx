"use client"

import {
  V2AccountType,
  V2CategoryType,
  V2HydratedBudgetType,
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
import AddTransaction from "./forms/AddTransaction"
import AccountSettingsCard from "./settings-cards/AccountSettingsCard"
import BudgetSettingsCard from "./settings-cards/BudgetSettingsCard"
import CategorySettingsCard from "./settings-cards/CategorySettingsCard"
import MerchantSettingsCard from "./settings-cards/MerchantSettingsCard"
import { hydrateBudgets, hydrateTransactions } from "./utils"

const V2Page = () => {
  const [accounts, setAccounts] = useState<V2AccountType[]>([])
  const [budgets, setBudgets] = useState<V2HydratedBudgetType[]>([])
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
    setAccounts(a ?? [])
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
    setCategories(c ?? [])
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
    setMerchants(m ?? [])
  }

  // Initial data fetch
  useEffect(() => {
    const fetchAccounts = async () => {
      await refreshAccounts()
      await refreshCategories()
      await refreshMerchants()
    }
    fetchAccounts()
  }, [])

  // Fetch hydrated data (transactions, budgets)
  useEffect(() => {
    if (
      accounts.length == 0 ||
      categories.length == 0 ||
      merchants.length == 0
    ) {
      return
    }

    async function fetchTransactions() {
      const t = await getTransactionsV2({
        filters: [
          {
            column: "deleted_at",
            operator: "eq",
            value: null,
          },
        ],
      })
      const b = await getBudgetsV2({
        filters: [
          {
            column: "deleted_at",
            operator: "eq",
            value: null,
          },
        ],
      })
      const ht = hydrateTransactions({
        accounts: accounts,
        categories: categories,
        merchants: merchants,
        transactions: t ?? [],
      })
      const hb = hydrateBudgets({
        categories: categories,
        budgets: b ?? [],
      })

      setT(ht)
      setBudgets(hb)
    }

    fetchTransactions()
  }, [accounts, categories, merchants])

  return (
    <Stack gap={1} divider={<hr />}>
      <AccountSettingsCard accounts={accounts} />
      <CategorySettingsCard categories={categories} />
      <MerchantSettingsCard merchants={merchants} categories={categories} />
      <BudgetSettingsCard budgets={budgets} categories={categories} />

      <AddTransaction
        accounts={accounts}
        categories={categories}
        merchants={merchants}
      />

      {/* {t.map((transaction) => (
        <div
          key={transaction.transaction_id}
          style={{
            border: `1px solid ${transaction.category_color!}`,
            color: transaction.category_color!,
          }}
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
      ))} */}
    </Stack>
  )
}

export default V2Page
