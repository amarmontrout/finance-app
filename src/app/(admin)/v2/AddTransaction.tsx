import {
  TransactionStatusValue,
  TransactionTypeValue,
  V2AccountType,
  V2CategoryType,
  V2MerchantType,
} from "@/api/v2/models"
import { saveTransactionV2 } from "@/api/v2/requests"
import { Stack } from "@mui/material"
import { useEffect, useMemo, useState } from "react"

export function AccountDropdown({
  accounts,
  value,
  onChange,
  disabled = false,
}: {
  accounts: V2AccountType[]
  value: string | null
  onChange: (accountId: string) => void
  disabled?: boolean
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      <option value="" disabled>
        Select account
      </option>

      {accounts
        .filter((account) => !account.deleted_at)
        .map((account) => (
          <option key={account.account_id} value={account.account_id}>
            {account.name} - {account.type}
          </option>
        ))}
    </select>
  )
}

export function CategoryDropdown({
  categories,
  value,
  onChange,
  disabled = false,
}: {
  categories: V2CategoryType[]
  value: string | null
  onChange: (categoryId: string) => void
  disabled?: boolean
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      <option value="" disabled>
        Select category
      </option>

      {categories
        .filter((category) => !category.deleted_at)
        .map((category) => (
          <option key={category.category_id} value={category.category_id}>
            {category.name}
          </option>
        ))}
    </select>
  )
}

export function MerchantDropdown({
  merchants,
  value,
  onChange,
  disabled = false,
}: {
  merchants: V2MerchantType[]
  value: string | null
  onChange: (merchantId: string) => void
  disabled?: boolean
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      <option value="" disabled>
        Select merchant
      </option>

      {merchants
        .filter((merchant) => !merchant.deleted_at)
        .map((merchant) => (
          <option key={merchant.merchant_id} value={merchant.merchant_id}>
            {merchant.name}
          </option>
        ))}
    </select>
  )
}

const DEFAULT_TRANSACTION_TYPES = [
  { value: "Income", label: "Income" },
  { value: "Expense", label: "Expense" },
  { value: "Refund", label: "Refund" },
]

const DEFAULT_STATUS = [
  { value: "Unpaid", label: "Unpaid" },
  { value: "Paid", label: "Paid" },
]

const getToday = () => {
  const date = new Date()

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`
}

const AddTransaction = ({
  accounts,
  categories,
  merchants,
}: {
  accounts: V2AccountType[]
  categories: V2CategoryType[]
  merchants: V2MerchantType[]
}) => {
  const [accountId, setAccountId] = useState<string | null>(null)
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [merchantId, setMerchantId] = useState<string | null>(null)
  const [amount, setAmount] = useState<string>("")
  const [transactionType, setTransactionType] =
    useState<TransactionTypeValue>("Income")
  const [transactionDescription, setTransactionDescription] =
    useState<string>("")
  const [transactionDate, setTransactionDate] = useState(getToday())
  const [status, setStatus] = useState<TransactionStatusValue>("Unpaid")
  const [recurring, setRecurring] = useState<boolean>(false)

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.category_id, c])),
    [categories],
  )

  const merchantMap = useMemo(
    () => new Map(merchants.map((m) => [m.merchant_id, m])),
    [merchants],
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await saveTransactionV2({
      body: {
        account_id: accountId!,
        category_id: categoryId!,
        merchant_id: merchantId!,
        amount: Number(amount),
        transaction_type: transactionType,
        description: transactionDescription,
        transaction_date: transactionDate,
        status: status,
        is_recurring: recurring,
      },
    })

    setAccountId(null)
    setCategoryId(null)
    setMerchantId(null)
    setAmount("0")
    setTransactionType("Income")
    setTransactionDescription("")
    setTransactionDate(getToday())
    setStatus("Unpaid")
    setRecurring(false)
  }

  useEffect(() => {
    if (!categoryId) return
    const category = categoryMap.get(categoryId)
    if (category) {
      setTransactionType(category.default_transaction_type)
    }
  }, [categoryId, categoryMap])

  useEffect(() => {
    if (!merchantId || categoryId) return
    const merchant = merchantMap.get(merchantId)
    if (merchant?.default_category_id) {
      setCategoryId(merchant.default_category_id)
    }
  }, [merchantId, categoryId, merchantMap])

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={1} border={"1px solid red"}>
        <AccountDropdown
          accounts={accounts}
          value={accountId}
          onChange={setAccountId}
        />

        <CategoryDropdown
          categories={categories}
          value={categoryId}
          onChange={setCategoryId}
        />

        <MerchantDropdown
          merchants={merchants}
          value={merchantId}
          onChange={setMerchantId}
        />

        <Stack direction={"row"} gap={1}>
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="$0"
          />
        </Stack>

        <Stack direction={"row"} gap={1}>
          <label htmlFor="transaction-type">Transaction Type</label>
          <select
            id="transaction-type"
            value={transactionType}
            onChange={(e) =>
              setTransactionType(e.target.value as TransactionTypeValue)
            }
          >
            {DEFAULT_TRANSACTION_TYPES.map((categoryType) => (
              <option key={categoryType.value} value={categoryType.value}>
                {categoryType.label}
              </option>
            ))}
          </select>
        </Stack>

        <Stack direction={"row"} gap={1}>
          <label htmlFor="description">Description</label>
          <input
            id="description"
            value={transactionDescription}
            onChange={(e) => setTransactionDescription(e.target.value)}
            placeholder="Enter description"
          />
        </Stack>

        <Stack direction={"row"} gap={1}>
          <label htmlFor="date">Transaction Date</label>
          <input
            id="date"
            type="date"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
          />
        </Stack>

        <Stack direction={"row"} gap={1}>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as TransactionStatusValue)
            }
          >
            {DEFAULT_STATUS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </Stack>

        <button type="submit">Add Transaction</button>
      </Stack>
    </form>
  )
}

export default AddTransaction
