"use client"

import {
  V2AccountType,
  V2BudgetType,
  V2CategoryType,
  V2MerchantType,
  V2TransactionType,
} from "@/api/v2/models"
import {
  getAccountsV2,
  getBudgetsV2,
  getCategoriesV2,
  getMerchantsV2,
  getTransactionsV2,
} from "@/api/v2/requests"
import { useEffect, useState } from "react"

const V2Page = () => {
  const [account, setAccounts] = useState<V2AccountType[]>([])
  const [budget, setBudget] = useState<V2BudgetType[]>([])
  const [category, setCategory] = useState<V2CategoryType[]>([])
  const [merchant, setMerchant] = useState<V2MerchantType[]>([])
  const [transaction, setTransaction] = useState<V2TransactionType[]>([])

  useEffect(() => {
    async function fetchAccounts() {
      const a = await getAccountsV2({})
      const b = await getBudgetsV2({})
      const c = await getCategoriesV2({})
      const m = await getMerchantsV2({})
      const t = await getTransactionsV2({})

      setAccounts(a ?? [])
      setBudget(b ?? [])
      setCategory(c ?? [])
      setMerchant(m ?? [])
      setTransaction(t ?? [])
    }

    fetchAccounts()
  }, [])

  return (
    <div>
      {account.map((account) => (
        <div key={account.account_id}>
          <div>{account.account_id}</div>
          <div>{account.name}</div>
          <div>{account.type}</div>
          <div>{account.deleted_at} d</div>
        </div>
      ))}
      <hr />
      {budget.map((budget) => (
        <div key={budget.budget_id}>
          <div>{budget.budget_id}</div>
          <div>{budget.category_id}</div>
          <div>{budget.start_date}</div>
          <div>{budget.end_date}</div>
          <div>{budget.amount}</div>
          <div>{budget.deleted_at}</div>
        </div>
      ))}
      <hr />
      {category.map((category) => (
        <div key={category.category_id}>
          <div>{category.category_id}</div>
          <div>{category.parent_id}</div>
          <div>{category.name}</div>
          <div>{category.default_transaction_type}</div>
          <div>{category.color}</div>
          <div>{category.deleted_at}</div>
        </div>
      ))}
      <hr />
      {merchant.map((merchant) => (
        <div key={merchant.merchant_id}>
          <div>{merchant.merchant_id}</div>
          <div>{merchant.default_category_id}</div>
          <div>{merchant.name}</div>
          <div>{merchant.deleted_at}</div>
        </div>
      ))}
      <hr />
      {transaction.map((transaction) => (
        <div key={transaction.transaction_id}>
          <div>{transaction.transaction_id}</div>
          <div>{transaction.account_id}</div>
          <div>{transaction.category_id}</div>
          <div>{transaction.merchant_id}</div>
          <div>{transaction.parent_transaction_id}</div>
          <div>{transaction.amount}</div>
          <div>{transaction.transaction_type}</div>
          <div>{transaction.description}</div>
          <div>{transaction.notes}</div>
          <div>{transaction.transaction_date}</div>
          <div>{transaction.status}</div>
          <div>{transaction.is_recurring}</div>
          <div>{transaction.created_at}</div>
          <div>{transaction.deleted_at}</div>
        </div>
      ))}
    </div>
  )
}

export default V2Page
