import { DateType, TransactionType } from "@/api/transactions/models"
import {
  TransactionTypeValue,
  V2AccountType,
  V2CategoryType,
  V2MerchantType,
} from "@/api/v2/models"
import { saveTransactionV2 } from "@/api/v2/requests"
import { HookSetter } from "@/types/types"
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { DEFAULT_TRANSACTION_TYPES } from "../constants"
import { formatDate, getToday } from "../utils"

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
    <FormControl size={"small"} fullWidth>
      <InputLabel id={"select-account-label"}>Select Account</InputLabel>

      <Select
        size={"small"}
        labelId={"select-account-label"}
        variant={"standard"}
        label={"Select Account"}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {accounts
          .filter((account) => !account.deleted_at)
          .map((account) => (
            <MenuItem key={account.account_id} value={account.account_id}>
              {account.name}
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
    <FormControl size={"small"} fullWidth>
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
    <FormControl size={"small"} fullWidth>
      <InputLabel id={"select-merchant-label"}>Select Merchant</InputLabel>
      <Select
        size={"small"}
        labelId={"select-merchant-label"}
        label={"Select Merchant"}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        fullWidth
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

const Row = ({
  active,
  label,
  display,
  edit,
  onClick,
}: {
  active?: boolean
  label: string
  display: React.ReactNode
  edit?: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}) => {
  return (
    <Stack
      direction={"row"}
      sx={{
        minHeight: "36px",
        justifyContent: "space-between",
        alignItems: "stretch",
      }}
    >
      <Typography
        sx={{
          display: "flex",
          flex: 1,
          alignItems: "center",
        }}
      >
        {label}
      </Typography>
      <Box
        onClick={onClick}
        sx={{
          minWidth: 0,
          flex: 1.5,
          textAlign: "right",
          alignContent: "Center",
        }}
      >
        {active ? edit : display}
      </Box>
    </Stack>
  )
}

const AddTransaction = ({
  accounts,
  categories,
  merchants,
  v1Transaction,
  index,
  setIndex,
}: {
  accounts: V2AccountType[]
  categories: V2CategoryType[]
  merchants: V2MerchantType[]
  v1Transaction?: TransactionType[]
  index: number
  setIndex: HookSetter<number>
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
  const [isPaid, setIsPaid] = useState<boolean | null>(null)

  const [activeField, setActiveField] = useState<
    "date" | "category" | "account" | "merchant" | "description" | "type" | null
  >(null)

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.category_id, c])),
    [categories],
  )

  const merchantMap = useMemo(
    () => new Map(merchants.map((m) => [m.merchant_id, m])),
    [merchants],
  )

  const accountMap = useMemo(
    () => new Map(accounts.map((a) => [a.account_id, a])),
    [accounts],
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
        is_paid: isPaid,
      },
    })
    setIndex(index + 1)
    setAccountId(null)
    setCategoryId(null)
    setMerchantId(null)
    setAmount("0")
    setTransactionType("Income")
    setTransactionDescription("")
    setTransactionDate(getToday())
    setIsPaid(false)
  }

  const handleOpen = (field: typeof activeField) => {
    setActiveField(field)
  }

  // Handles updating transaction type when category is selected
  useEffect(() => {
    if (!categoryId) return
    const category = categoryMap.get(categoryId)
    if (category) {
      setTransactionType(category.default_transaction_type)
      setAccountId(category.default_account_id)
    }
  }, [categoryId, categoryMap])

  // Handles updating the category when a merchant is selected
  useEffect(() => {
    if (!merchantId) return
    const merchant = merchantMap.get(merchantId)
    if (merchant?.default_category_id) {
      setCategoryId(merchant.default_category_id)
    }
  }, [merchantId, merchantMap])

  // Handles setting paid or not when transaction type changes
  useEffect(() => {
    if (transactionType !== "Expense") {
      setIsPaid(null)
    } else {
      setIsPaid(true)
    }
  }, [transactionType, accountId])

  const categoryMapV1 = useMemo(
    () => new Map(categories.map((c) => [c.name, c])),
    [categories],
  )

  const merchantMapV1 = useMemo(
    () => new Map(merchants.map((m) => [m.name, m])),
    [merchants],
  )

  const accountMapV1 = useMemo(
    () => new Map(accounts.map((a) => [a.type, a])),
    [accounts],
  )

  const toDateString = ({ month, day, year }: DateType): string => {
    const date = new Date(`${month} ${day}, ${year}`)
    return date.toISOString().split("T")[0]
  }

  useEffect(() => {
    if (v1Transaction === undefined || v1Transaction.length === 0) return

    setAmount(String(v1Transaction[index].amount))
    setTransactionDate(toDateString(v1Transaction[index].date))
    setCategoryId(
      categoryMapV1.get(v1Transaction[index].category)?.category_id ?? null,
    )
    setMerchantId(
      merchantMapV1.get(v1Transaction[index].note)?.merchant_id ?? null,
    )
    setAccountId(
      v1Transaction[index].payment_method === "Credit"
        ? accountMapV1.get("Credit Card")?.account_id!
        : accountMapV1.get("Checking")?.account_id!,
    )
    setIsPaid(v1Transaction[index].is_paid)
  }, [v1Transaction, index])

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction={"column"} spacing={0.5} divider={<hr />}>
        <TextField
          id={"amount"}
          label={"Amount"}
          size={"small"}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={"$0"}
        />

        <Row
          active={activeField === "date"}
          label={"Date"}
          display={<Typography>{formatDate(transactionDate)}</Typography>}
          edit={
            <TextField
              id={"date"}
              fullWidth
              type={"date"}
              label={"Transaction Date"}
              size={"small"}
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
            />
          }
          onClick={
            activeField !== "date" ? () => handleOpen("date") : undefined
          }
        />

        <Row
          active={activeField === "category"}
          label={"Category"}
          display={
            <Typography>
              {categoryMap.get(categoryId!)?.name ?? "Select Category"}
            </Typography>
          }
          edit={
            <Autocomplete
              options={categories}
              getOptionLabel={(option) => option.name}
              value={
                categories.find((c) => c.category_id === categoryId) ?? null
              }
              onChange={(_, newValue) => {
                setCategoryId(newValue?.category_id ?? null)
              }}
              isOptionEqualToValue={(option, value) =>
                option.category_id === value.category_id
              }
              onClose={() => {
                setActiveField(null)
              }}
              openOnFocus
              popupIcon={null}
              freeSolo={false}
              slotProps={{
                listbox: {
                  style: {
                    maxHeight: 5 * 39,
                  },
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  autoFocus
                  placeholder="Select Merchant"
                  sx={{
                    fontSize: "16px",
                    maxHeight: 36,
                    "& .MuiInputBase-root": { fontSize: "16px" },
                    "& input": { padding: 0, margin: 0, fontSize: "16px" },
                  }}
                />
              )}
            />
          }
          onClick={
            activeField !== "category"
              ? () => handleOpen("category")
              : undefined
          }
        />

        <Row
          active={activeField === "merchant"}
          label={"Merchant"}
          display={
            <Typography>
              {merchantMap.get(merchantId!)?.name ?? "Select Merchant"}
            </Typography>
          }
          edit={
            <Autocomplete
              options={merchants}
              getOptionLabel={(option) => option.name}
              value={
                merchants.find((m) => m.merchant_id === merchantId) ?? null
              }
              onChange={(_, newValue) => {
                setMerchantId(newValue?.merchant_id ?? null)
              }}
              isOptionEqualToValue={(option, value) =>
                option.merchant_id === value.merchant_id
              }
              onClose={() => {
                setActiveField(null)
              }}
              openOnFocus
              popupIcon={null}
              freeSolo={false}
              slotProps={{
                listbox: {
                  style: {
                    maxHeight: 5 * 39,
                  },
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  autoFocus
                  placeholder="Select Merchant"
                  sx={{
                    fontSize: "16px",
                    maxHeight: 36,
                    "& .MuiInputBase-root": { fontSize: "16px" },
                    "& input": { padding: 0, margin: 0, fontSize: "16px" },
                  }}
                />
              )}
            />
          }
          onClick={
            activeField !== "merchant"
              ? () => handleOpen("merchant")
              : undefined
          }
        />

        <Row
          active={activeField === "account"}
          label={"Payment Account"}
          display={
            <Typography>
              {accountMap.get(accountId!)?.name ?? "Select Account"}
            </Typography>
          }
          edit={
            <Autocomplete
              options={accounts}
              getOptionLabel={(option) => option.name}
              value={accounts.find((a) => a.account_id === accountId) ?? null}
              onChange={(_, newValue) => {
                setAccountId(newValue?.account_id ?? null)
              }}
              isOptionEqualToValue={(option, value) =>
                option.account_id === value.account_id
              }
              onClose={() => {
                setActiveField(null)
              }}
              openOnFocus
              popupIcon={null}
              freeSolo={false}
              slotProps={{
                listbox: {
                  style: {
                    maxHeight: 5 * 39,
                  },
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  autoFocus
                  placeholder="Select Account"
                  sx={{
                    fontSize: "16px",
                    maxHeight: 36,
                    "& .MuiInputBase-root": { fontSize: "16px" },
                    "& input": { padding: 0, margin: 0, fontSize: "16px" },
                  }}
                />
              )}
            />
          }
          onClick={
            activeField !== "account" ? () => handleOpen("account") : undefined
          }
        />

        <Row
          active={activeField === "type"}
          label={"Type"}
          display={<Typography>{transactionType}</Typography>}
          edit={
            <Autocomplete
              options={DEFAULT_TRANSACTION_TYPES}
              value={transactionType}
              onChange={(_, newValue) => {
                setTransactionType(
                  (newValue as TransactionTypeValue) ?? "Income",
                )
              }}
              isOptionEqualToValue={(option, value) => option === value}
              onClose={() => {
                setActiveField(null)
              }}
              openOnFocus
              popupIcon={null}
              freeSolo={false}
              slotProps={{
                listbox: {
                  style: {
                    maxHeight: 5 * 39,
                  },
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  autoFocus
                  placeholder="Select Type"
                  sx={{
                    fontSize: "16px",
                    maxHeight: 36,
                    "& .MuiInputBase-root": { fontSize: "16px" },
                    "& input": { padding: 0, margin: 0, fontSize: "16px" },
                  }}
                />
              )}
            />
          }
          onClick={
            activeField !== "type" ? () => handleOpen("type") : undefined
          }
        />

        {transactionType === "Expense" && (
          <Row
            label={"Is Paid"}
            display={
              <Checkbox
                sx={{ p: 0 }}
                size={"small"}
                disableRipple
                checked={isPaid ? isPaid : false}
                onChange={(e) => setIsPaid(e.target.checked)}
              />
            }
          />
        )}

        <Row
          active={activeField === "description"}
          label={"Description"}
          display={
            <Typography>
              {transactionDescription !== ""
                ? transactionDescription
                : "Add a Description"}
            </Typography>
          }
          edit={
            <TextField
              id={"description"}
              variant={"standard"}
              size={"small"}
              value={transactionDescription}
              onChange={(e) => setTransactionDescription(e.target.value)}
              multiline
              minRows={1}
              sx={{
                width: "100%",
                "& .MuiInputBase-root": {
                  minHeight: 36,
                },
                "& textarea": {
                  fontSize: "16px",
                },
              }}
              placeholder="Enter Description"
            />
          }
          onClick={
            activeField !== "description"
              ? () => handleOpen("description")
              : undefined
          }
        />

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
