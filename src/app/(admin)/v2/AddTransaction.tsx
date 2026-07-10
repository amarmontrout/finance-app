import {
  TransactionStatusValue,
  TransactionTypeValue,
  V2AccountType,
  V2CategoryType,
  V2MerchantType,
} from "@/api/v2/models"
import { saveTransactionV2 } from "@/api/v2/requests"
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material"
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
    <FormControl size={"small"}>
      <InputLabel id={"select-account-label"}>Select Account</InputLabel>

      <Select
        size={"small"}
        labelId={"select-account-label"}
        label={"Select Account"}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {accounts
          .filter((account) => !account.deleted_at)
          .map((account) => (
            <MenuItem key={account.account_id} value={account.account_id}>
              {account.name} - {account.type}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
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
    <FormControl size={"small"}>
      <InputLabel id={"select-category-label"}>Select Category</InputLabel>

      <Select
        size={"small"}
        labelId={"select-category-label"}
        label={"Select Category"}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {categories
          .filter((category) => !category.deleted_at)
          .map((category) => (
            <MenuItem key={category.category_id} value={category.category_id}>
              {category.name}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
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
    <FormControl size={"small"}>
      <InputLabel id={"select-merchant-label"}>Select Merchant</InputLabel>
      <Select
        size={"small"}
        labelId={"select-merchant-label"}
        label={"Select Merchant"}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {merchants
          .filter((merchant) => !merchant.deleted_at)
          .map((merchant) => (
            <MenuItem key={merchant.merchant_id} value={merchant.merchant_id}>
              {merchant.name}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
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
      <Stack gap={1}>
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

        <TextField
          id={"amount"}
          label={"Amount"}
          size={"small"}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={"$0"}
        />

        <FormControl size={"small"}>
          <InputLabel id={"transaction-type-label"}>
            Transaction Type
          </InputLabel>

          <Select
            id={"transaction-type"}
            labelId={"transaction-type"}
            label={"Transaction Type"}
            size={"small"}
            value={transactionType}
            onChange={(e) =>
              setTransactionType(e.target.value as TransactionTypeValue)
            }
          >
            {DEFAULT_TRANSACTION_TYPES.map((categoryType) => (
              <MenuItem key={categoryType.value} value={categoryType.value}>
                {categoryType.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          id={"description"}
          label={"Description"}
          size={"small"}
          value={transactionDescription}
          onChange={(e) => setTransactionDescription(e.target.value)}
          placeholder="Enter description"
        />

        <TextField
          id={"date"}
          type={"date"}
          label={"Transaction Date"}
          size={"small"}
          value={transactionDate}
          onChange={(e) => setTransactionDate(e.target.value)}
        />

        <FormControl size={"small"}>
          <InputLabel id={"status-label"}>Status</InputLabel>

          <Select
            id={"status"}
            labelId={"status-label"}
            label={"Status"}
            size={"small"}
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as TransactionStatusValue)
            }
          >
            {DEFAULT_STATUS.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          type={"submit"}
          variant={"contained"}
          disabled={!accountId || !categoryId || !merchantId || amount == ""}
        >
          Add Transaction
        </Button>
      </Stack>
    </form>
  )
}

export default AddTransaction
