import {
  CreateTransactionType,
  TransactionType,
  TransactionTypeValue,
} from "@/app/(api)/transactions/models"
import { useDataContext } from "@/app/contexts/data-context"
import { useTransactionContext } from "@/app/contexts/transaction-context"
import { TEXT_COLOR } from "@/app/data/colors"
import { formatDate } from "@/app/lib/functions/formatters"
import { HookSetter } from "@/app/lib/types"
import { Button, Stack, Typography } from "@mui/material"
import { RefObject, useEffect, useState } from "react"
import Center from "../Center"
import AutocompleteInput from "../inputs/AutocompleteInput"
import CheckboxInput from "../inputs/CheckboxInput"
import DateInput from "../inputs/DateInput"
import DescriptionInput from "../inputs/DescriptionInput"
import MoneyInput from "../inputs/MoneyInput"
import TransactionTypeToggle from "../inputs/TransactionTypeToggle"
import FormRow from "../ui/FormRow"

export type ActiveFieldType =
  | "date"
  | "category"
  | "account"
  | "merchant"
  | "description"
  | null

const TransactionForm = <T extends CreateTransactionType | TransactionType>({
  isEditing,
  transaction,
  setTransaction,
  inputRef,
  setOpenAddMerchant,
  setOpenAddCategory,
  setOpenAddAccount,
}: {
  isEditing: boolean
  transaction: T
  setTransaction: (transaction: T) => void
  inputRef: RefObject<HTMLInputElement | null>
  setOpenAddMerchant: HookSetter<boolean>
  setOpenAddCategory: HookSetter<boolean>
  setOpenAddAccount: HookSetter<boolean>
}) => {
  // HOOKS =====================================================================

  const {
    accounts,
    accountMap,
    categories,
    categoryMap,
    merchants,
    merchantMap,
  } = useDataContext()

  const { setOpenAddReturn } = useTransactionContext()

  // STATE =====================================================================

  const [activeField, setActiveField] = useState<ActiveFieldType>(null)

  // FUNCTIONS =================================================================

  const updateTransaction = <K extends keyof CreateTransactionType>(
    key: K,
    value: CreateTransactionType[K],
  ) => {
    setTransaction({ ...transaction, [key]: value })
  }

  // USEEFFECTS ================================================================

  // Handles updating transaction type when category is selected
  useEffect(() => {
    if (!transaction.category_id || isEditing) return
    const category = categoryMap.get(transaction.category_id)
    if (category) {
      setTransaction({
        ...transaction,
        transaction_type: category.default_transaction_type,
        account_id: category.default_account_id,
      })
    }
  }, [transaction.category_id, categoryMap, isEditing])

  // Handles updating the category when a merchant is selected
  useEffect(() => {
    if (!transaction.merchant_id || isEditing) return
    const merchant = merchantMap.get(transaction.merchant_id)
    if (merchant?.default_category_id) {
      setTransaction({
        ...transaction,
        category_id: merchant.default_category_id,
      })
    }
  }, [transaction.merchant_id, merchantMap, isEditing])

  // Handles setting paid or not when transaction type changes
  useEffect(() => {
    if (isEditing) return
    setTransaction({
      ...transaction,
      is_paid: transaction.transaction_type === "Expense" ? true : null,
    })
  }, [transaction.transaction_type, isEditing])

  // Autofocus on MoneyInput if transaction_type changes
  useEffect(() => {
    inputRef.current?.focus()
  }, [transaction.transaction_type, inputRef])

  // RETURN ====================================================================

  return (
    <Stack direction={"column"} spacing={2}>
      {!isEditing && (
        <Center>
          <TransactionTypeToggle
            transactionType={transaction.transaction_type}
            setTransactionType={(value) =>
              updateTransaction(
                "transaction_type",
                value as TransactionTypeValue,
              )
            }
          />
        </Center>
      )}

      <MoneyInput
        value={transaction.amount}
        onChange={(value) => updateTransaction("amount", value)}
        inputRef={inputRef}
      />

      <Stack
        direction={"column"}
        spacing={0.5}
        divider={<hr />}
        sx={{ width: "100%" }}
      >
        {/* DATE */}
        <FormRow
          active={activeField === "date"}
          label={"Date"}
          display={
            <Typography>{formatDate(transaction.transaction_date)}</Typography>
          }
          edit={
            <DateInput
              value={transaction.transaction_date}
              onChange={(value) => updateTransaction("transaction_date", value)}
              autoFocus={activeField === "date"}
              onBlur={() => setActiveField(null)}
            />
          }
          onClick={
            activeField !== "date" ? () => setActiveField("date") : undefined
          }
        />

        {/* MERCHANT */}
        <FormRow
          active={activeField === "merchant"}
          label={"Merchant"}
          display={
            <Typography>
              {merchantMap.get(transaction.merchant_id!)?.name ??
                "Select Merchant"}
            </Typography>
          }
          edit={
            <AutocompleteInput
              options={merchants}
              value={merchantMap.get(transaction.merchant_id ?? "") ?? null}
              onChange={(merchant) =>
                updateTransaction("merchant_id", merchant?.merchant_id ?? "")
              }
              getOptionLabel={(merchant) => merchant.name}
              isOptionEqualToValue={(a, b) => a.merchant_id === b.merchant_id}
              placeholder={"Select Merchant"}
              openOnFocus={activeField === "merchant"}
              setAddFormOpen={() => setOpenAddMerchant(true)}
              onBlur={() => setActiveField(null)}
            />
          }
          onClick={
            activeField !== "merchant"
              ? () => setActiveField("merchant")
              : undefined
          }
        />

        {/* CATEGORY */}
        <FormRow
          active={activeField === "category"}
          label={"Category"}
          display={
            <Typography>
              {categoryMap.get(transaction.category_id!)?.name ??
                "Select Category"}
            </Typography>
          }
          edit={
            <AutocompleteInput
              options={categories}
              value={categoryMap.get(transaction.category_id ?? "") ?? null}
              onChange={(category) =>
                updateTransaction("category_id", category?.category_id ?? "")
              }
              getOptionLabel={(category) => category.name}
              isOptionEqualToValue={(a, b) => a.category_id === b.category_id}
              placeholder={"Select Category"}
              openOnFocus={activeField === "category"}
              setAddFormOpen={() => setOpenAddCategory(true)}
              onBlur={() => setActiveField(null)}
            />
          }
          onClick={
            activeField !== "category"
              ? () => setActiveField("category")
              : undefined
          }
        />

        {/* ACCOUNT */}
        <FormRow
          active={activeField === "account"}
          label={"Account"}
          display={
            <Typography>
              {accountMap.get(transaction.account_id!)?.name ??
                "Select Account"}
            </Typography>
          }
          edit={
            <AutocompleteInput
              options={accounts}
              value={accountMap.get(transaction.account_id ?? "") ?? null}
              onChange={(account) =>
                updateTransaction("account_id", account?.account_id ?? "")
              }
              getOptionLabel={(account) => account.name}
              isOptionEqualToValue={(a, b) => a.account_id === b.account_id}
              placeholder={"Select Account"}
              openOnFocus={activeField === "account"}
              setAddFormOpen={() => setOpenAddAccount(true)}
              onBlur={() => setActiveField(null)}
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
          <FormRow
            label={"Is Paid"}
            display={
              <CheckboxInput
                checked={transaction.is_paid ?? false}
                onChange={(value) => updateTransaction("is_paid", value)}
              />
            }
          />
        )}

        {/* DESCRIPTION */}
        <FormRow
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
            <DescriptionInput
              value={transaction.description ?? ""}
              onChange={(value) => updateTransaction("description", value)}
              autoFocus={activeField === "description"}
              onBlur={() => setActiveField(null)}
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
          sx={{ color: TEXT_COLOR, borderColor: TEXT_COLOR }}
          onClick={() => setOpenAddReturn(true)}
          disabled={!transaction.is_paid}
        >
          Create Return
        </Button>
      )}
    </Stack>
  )
}

export default TransactionForm
