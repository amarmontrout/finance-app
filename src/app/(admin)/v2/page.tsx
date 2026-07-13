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
import AddIcon from "@mui/icons-material/Add"
import { Box, IconButton, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import AddAccount from "./AddAccount"
import AddBudget from "./AddBudget"
import AddCategory from "./AddCategory"
import AddMerchant from "./AddMerchant"
import { hydrateBudgets, hydrateTransactions } from "./utils"

const V2Page = () => {
  const [accounts, setAccounts] = useState<V2AccountType[]>([])
  const [budgets, setBudgets] = useState<V2HydratedBudgetType[]>([])
  const [categories, setCategories] = useState<V2CategoryType[]>([])
  const [merchants, setMerchants] = useState<V2MerchantType[]>([])
  const [t, setT] = useState<V2HydratedTransactionType[]>([])

  const [showAccountForm, setShowAccountForm] = useState<boolean>(false)
  const [showCategoryForm, setShowCategoryForm] = useState<boolean>(false)
  const [showMerchantForm, setShowMerchantForm] = useState<boolean>(false)
  const [showBudgetForm, setShowBudgetForm] = useState<boolean>(false)

  const refreshAccounts = async () => {
    const a = await getAccountsV2({})
    setAccounts(a ?? [])
  }

  const refreshCategories = async () => {
    const c = await getCategoriesV2({})
    setCategories(c ?? [])
  }

  const refreshMerchants = async () => {
    const m = await getMerchantsV2({})
    setMerchants(m ?? [])
  }

  useEffect(() => {
    const fetchAccounts = async () => {
      await refreshAccounts()
      await refreshCategories()
      await refreshMerchants()
    }
    fetchAccounts()
  }, [])

  useEffect(() => {
    if (
      accounts.length == 0 ||
      categories.length == 0 ||
      merchants.length == 0
    ) {
      return
    }

    async function fetchTransactions() {
      const t = await getTransactionsV2({})
      const b = await getBudgetsV2({})
      const ht = hydrateTransactions({
        accounts: accounts,
        categories: categories,
        merchants: merchants,
        transactions: t!,
      })
      const hb = hydrateBudgets({
        categories: categories,
        budgets: b!,
      })

      setT(ht)
      setBudgets(hb)
    }

    fetchTransactions()
  }, [accounts, categories, merchants])

  return (
    <Stack gap={1} divider={<hr />}>
      {/* Accounts card */}
      <Stack
        direction={"column"}
        spacing={1}
        divider={<hr />}
        bgcolor={"white"}
        borderRadius={2}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          paddingX={1}
          paddingTop={1}
        >
          <Typography variant={"h5"}>Accounts</Typography>

          <IconButton
            size={"small"}
            disableRipple
            onClick={() => {
              setShowAccountForm(!showAccountForm)
            }}
          >
            <AddIcon
              fontSize={"small"}
              sx={{
                transform: showAccountForm ? "rotate(45deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </IconButton>
        </Stack>

        {(showAccountForm || accounts.length === 0) && (
          <Box paddingX={1}>
            <AddAccount />
          </Box>
        )}

        <Stack direction={"column"} spacing={1} paddingX={1} paddingBottom={1}>
          {accounts.map((account) => {
            return (
              <Stack
                key={account.account_id}
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Stack direction={"column"}>
                  <Typography variant={"body1"}>{account.name}</Typography>
                  <Typography variant={"body2"}>{account.type}</Typography>
                </Stack>

                <Box>Edit | Delete</Box>
              </Stack>
            )
          })}
        </Stack>
      </Stack>

      {/* Categories card */}
      <Stack
        direction={"column"}
        spacing={1}
        divider={<hr />}
        bgcolor={"white"}
        borderRadius={2}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          paddingX={1}
          paddingTop={1}
        >
          <Typography variant={"h5"}>Categories</Typography>

          <IconButton
            size={"small"}
            disableRipple
            onClick={() => {
              setShowCategoryForm(!showCategoryForm)
            }}
          >
            <AddIcon
              fontSize={"small"}
              sx={{
                transform: showCategoryForm ? "rotate(45deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </IconButton>
        </Stack>

        {(showCategoryForm || categories.length === 0) && (
          <Box paddingX={1}>
            <AddCategory />
          </Box>
        )}

        <Stack direction={"column"} spacing={1} paddingX={1} paddingBottom={1}>
          {categories.map((category) => {
            return (
              <Stack
                key={category.category_id}
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <Box
                    height={"10px"}
                    width={"10px"}
                    borderRadius={"50%"}
                    bgcolor={category.color ?? "black"}
                  />
                  <Typography variant={"body1"}>{category.name}</Typography>
                </Stack>

                <Box>Edit | Delete</Box>
              </Stack>
            )
          })}
        </Stack>
      </Stack>

      {/* Merchants card */}
      <Stack
        direction={"column"}
        spacing={1}
        divider={<hr />}
        bgcolor={"white"}
        borderRadius={2}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          paddingX={1}
          paddingTop={1}
        >
          <Typography variant={"h5"}>Merchants</Typography>

          <IconButton
            size={"small"}
            disableRipple
            onClick={() => {
              setShowMerchantForm(!showMerchantForm)
            }}
          >
            <AddIcon
              fontSize={"small"}
              sx={{
                transform: showMerchantForm ? "rotate(45deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </IconButton>
        </Stack>

        {(showMerchantForm || merchants.length === 0) && (
          <Box paddingX={1}>
            <AddMerchant categories={categories} />
          </Box>
        )}

        <Stack direction={"column"} spacing={1} paddingX={1} paddingBottom={1}>
          {merchants.map((merchant) => {
            return (
              <Stack
                key={merchant.merchant_id}
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography variant={"body1"}>{merchant.name}</Typography>

                <Box>Edit | Delete</Box>
              </Stack>
            )
          })}
        </Stack>
      </Stack>

      {/* Budgets card */}
      <Stack
        direction={"column"}
        spacing={1}
        divider={<hr />}
        bgcolor={"white"}
        borderRadius={2}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          paddingX={1}
          paddingTop={1}
        >
          <Typography variant={"h5"}>Budgets</Typography>

          <IconButton
            size={"small"}
            disableRipple
            onClick={() => {
              setShowBudgetForm(!showBudgetForm)
            }}
          >
            <AddIcon
              fontSize={"small"}
              sx={{
                transform: showBudgetForm ? "rotate(45deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </IconButton>
        </Stack>

        {(showBudgetForm || budgets.length === 0) && (
          <Box paddingX={1}>
            <AddBudget categories={categories} budgets={budgets} />
          </Box>
        )}

        <Stack direction={"column"} spacing={1} paddingX={1} paddingBottom={1}>
          {budgets.map((budget) => {
            return (
              <Stack
                key={budget.budget_id}
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Stack direction={"column"}>
                  <Typography variant={"body1"}>
                    {budget.category_name}
                  </Typography>
                  <Typography variant={"body2"}>{budget.amount}</Typography>
                </Stack>

                <Box>Edit | Delete</Box>
              </Stack>
            )
          })}
        </Stack>
      </Stack>

      {/* <AddTransaction
        accounts={accounts}
        categories={categories}
        merchants={merchants}
      /> */}

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
