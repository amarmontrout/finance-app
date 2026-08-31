import { V2CreateTransactionType } from "@/api/v2/models"
import { useDataContext } from "@/contexts/data-context"
import MoneyInput from "@/global/components/MoneyInput"
import { HookSetter } from "@/types/types"
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { RefObject, useEffect, useState } from "react"
import { formatDate } from "../utils"

type ActiveFieldType =
  | "date"
  | "category"
  | "account"
  | "merchant"
  | "description"
  | "type"
  | null

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
  inputRef,
  transaction,
  setTransaction,
  openDialog,
  isEditing,
}: {
  inputRef: RefObject<HTMLInputElement | null>
  transaction: V2CreateTransactionType
  setTransaction: HookSetter<V2CreateTransactionType>
  openDialog: boolean
  isEditing: boolean
}) => {
  const {
    categories,
    categoryMap,
    merchants,
    merchantMap,
    accounts,
    accountMap,
  } = useDataContext()

  const [activeField, setActiveField] = useState<ActiveFieldType>(null)

  // Handles updating transaction type when category is selected
  useEffect(() => {
    if (!transaction.category_id || isEditing) return
    const category = categoryMap.get(transaction.category_id)
    if (category) {
      setTransaction((prev) => ({
        ...prev,
        transaction_type: category.default_transaction_type,
        account_id: category.default_account_id,
      }))
    }
  }, [transaction.category_id, categoryMap])

  // Handles updating the category when a merchant is selected
  useEffect(() => {
    if (!transaction.merchant_id || isEditing) return
    const merchant = merchantMap.get(transaction.merchant_id)
    if (merchant?.default_category_id) {
      setTransaction((prev) => ({
        ...prev,
        category_id: merchant.default_category_id,
      }))
    }
  }, [transaction.merchant_id, merchantMap])

  // Handles setting paid or not when transaction type changes
  useEffect(() => {
    if (isEditing) return

    if (transaction.transaction_type !== "Expense") {
      setTransaction((prev) => ({
        ...prev,
        is_paid: null,
      }))
    } else {
      setTransaction((prev) => ({
        ...prev,
        is_paid: true,
      }))
    }
  }, [transaction.transaction_type, transaction.account_id])

  return (
    <Stack direction={"column"} spacing={2}>
      {/* AMOUNT */}
      <MoneyInput
        value={transaction.amount}
        setValue={setTransaction}
        inputRef={inputRef}
        autoFocus={openDialog}
      />

      <Stack direction={"column"} spacing={0.5} divider={<hr />}>
        {/* DATE */}
        <Row
          active={activeField === "date"}
          label={"Date"}
          display={
            <Typography>{formatDate(transaction.transaction_date)}</Typography>
          }
          edit={
            <TextField
              id={"date"}
              fullWidth
              type={"date"}
              label={"Transaction Date"}
              size={"small"}
              value={transaction.transaction_date}
              onChange={(e) =>
                setTransaction((prev) => ({
                  ...prev,
                  transaction_date: e.target.value,
                }))
              }
            />
          }
          onClick={
            activeField !== "date"
              ? () => {
                  setActiveField("date")
                }
              : undefined
          }
        />
        {/* MERCHANT */}
        <Row
          active={activeField === "merchant"}
          label={"Merchant"}
          display={
            <Typography>
              {merchantMap.get(transaction.merchant_id!)?.name ??
                "Select Merchant"}
            </Typography>
          }
          edit={
            <Autocomplete
              options={merchants}
              getOptionLabel={(option) => option.name}
              value={
                merchants.find(
                  (m) => m.merchant_id === transaction.merchant_id,
                ) ?? null
              }
              onChange={(_, newValue) => {
                setTransaction((prev) => ({
                  ...prev,
                  merchant_id: newValue?.merchant_id ?? null,
                }))
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
              ? () => setActiveField("merchant")
              : undefined
          }
        />
        {/* CATEGORY */}
        <Row
          active={activeField === "category"}
          label={"Category"}
          display={
            <Typography>
              {categoryMap.get(transaction.category_id!)?.name ??
                "Select Category"}
            </Typography>
          }
          edit={
            <Autocomplete
              options={categories}
              getOptionLabel={(option) => option.name}
              value={
                categories.find(
                  (c) => c.category_id === transaction.category_id,
                ) ?? null
              }
              onChange={(_, newValue) => {
                setTransaction((prev) => ({
                  ...prev,
                  category_id: newValue?.category_id ?? null,
                }))
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
              ? () => setActiveField("category")
              : undefined
          }
        />

        {/* ACCOUNT */}
        <Row
          active={activeField === "account"}
          label={"Payment Account"}
          display={
            <Typography>
              {accountMap.get(transaction.account_id!)?.name ??
                "Select Account"}
            </Typography>
          }
          edit={
            <Autocomplete
              options={accounts}
              getOptionLabel={(option) => option.name}
              value={
                accounts.find((a) => a.account_id === transaction.account_id) ??
                null
              }
              onChange={(_, newValue) => {
                setTransaction((prev) => ({
                  ...prev,
                  account_id: newValue?.account_id ?? null,
                }))
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
            activeField !== "account"
              ? () => setActiveField("account")
              : undefined
          }
        />

        {/* IS PAID */}
        {transaction.transaction_type === "Expense" && (
          <Row
            label={"Is Paid"}
            display={
              <Checkbox
                sx={{
                  p: 0,
                  color: "#A97C2F",
                  "&.Mui-checked": {
                    color: "#A97C2F",
                  },
                }}
                size={"small"}
                disableRipple
                checked={transaction.is_paid ? transaction.is_paid : false}
                onChange={(e) =>
                  setTransaction((prev) => ({
                    ...prev,
                    is_paid: e.target.checked,
                  }))
                }
              />
            }
          />
        )}

        {/* DESCRIPTION */}
        <Row
          active={activeField === "description"}
          label={"Description"}
          display={
            <Typography>
              {transaction.description !== ""
                ? transaction.description
                : "Add a Description"}
            </Typography>
          }
          edit={
            <TextField
              id={"description"}
              variant={"standard"}
              size={"small"}
              value={transaction.description}
              onChange={(e) =>
                setTransaction((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
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
              ? () => setActiveField("description")
              : undefined
          }
        />
      </Stack>

      {isEditing && transaction.transaction_type === "Expense" && (
        <Button
          variant={"outlined"}
          sx={{ color: "white", borderColor: "white" }}
          onClick={() => {}}
        >
          Create Return
        </Button>
      )}
    </Stack>
  )
}

export default AddTransaction
