"use client"

import { doLogout } from "@/api/auth/requests"
import {
  V2AccountType,
  V2CategoryType,
  V2HydratedBudgetType,
  V2MerchantType,
} from "@/api/v2/models"
import {
  getAccountsV2,
  getBudgetsV2,
  getCategoriesV2,
  getMerchantsV2,
} from "@/api/v2/requests"
import AlertToast from "@/global/components/AlertToast"
import {
  dateTypeToTimestamp,
  timestampToDateString,
} from "@/global/formattingFunctions"
import { getCurrentDateInfo } from "@/global/infoFunctions"
import { useUser } from "@/hooks/use-user"
import { AlertToastType } from "@/types/types"
import { Button, Stack, Typography } from "@mui/material"
import { AuthError } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AccountSettingsCard from "../v2/settings-cards/AccountSettingsCard"
import BudgetSettingsCard from "../v2/settings-cards/BudgetSettingsCard"
import CategorySettingsCard from "../v2/settings-cards/CategorySettingsCard"
import MerchantSettingsCard from "../v2/settings-cards/MerchantSettingsCard"
import { hydrateBudgets } from "../v2/utils"

const Settings = () => {
  const { today } = getCurrentDateInfo()
  const user = useUser()
  const router = useRouter()

  const [alertToast, setAlertToast] = useState<AlertToastType>()
  const [accounts, setAccounts] = useState<V2AccountType[]>([])
  const [budgets, setBudgets] = useState<V2HydratedBudgetType[]>([])
  const [categories, setCategories] = useState<V2CategoryType[]>([])
  const [merchants, setMerchants] = useState<V2MerchantType[]>([])

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

  const refreshBudgets = async () => {
    if (categories.length === 0) return
    const b = await getBudgetsV2({
      filters: [
        {
          column: "deleted_at",
          operator: "eq",
          value: null,
        },
      ],
    })
    const hb = hydrateBudgets({
      categories: categories,
      budgets: b ?? [],
    })
    setBudgets(
      hb.sort((x, y) =>
        x.category_name.localeCompare(y.category_name, undefined, {
          sensitivity: "base",
        }),
      ),
    )
  }

  const handleLogOut = () => {
    doLogout({
      router: router,
      errorHandler: (error: AuthError) => {
        console.error(error.message)
      },
    })
  }

  useEffect(() => {
    refreshAccounts()
    refreshCategories()
    refreshMerchants()
  }, [])

  // Fetch hydrated data (transactions, budgets)
  useEffect(() => {
    refreshBudgets()
  }, [accounts, categories, merchants])

  return (
    <Stack direction={"column"} spacing={3}>
      <Stack direction={"column"} alignItems={"center"}>
        <Typography variant={"caption"}>Welcome {user?.email}</Typography>

        <Typography fontWeight={"bold"}>
          {timestampToDateString(dateTypeToTimestamp(today))}
        </Typography>
      </Stack>

      <Button
        fullWidth
        color={"error"}
        variant={"contained"}
        onClick={handleLogOut}
      >
        Log out
      </Button>

      <Stack direction={"column"} spacing={1}>
        {/* <RecentlyDeleted
          deletedTransactions={deletedTransactions}
          refreshDeletedTransactions={refreshDeletedTransactions}
          refreshTransactions={refreshTransactions}
          setAlertToast={setAlertToast}
        /> */}
        <AccountSettingsCard
          accounts={accounts}
          refreshAccounts={refreshAccounts}
          setAlertToast={setAlertToast}
        />
        <CategorySettingsCard
          categories={categories}
          refreshCategories={refreshCategories}
          accounts={accounts}
          // setAlertToast={setAlertToast}
        />
        <MerchantSettingsCard
          merchants={merchants}
          categories={categories}
          refreshMerchants={refreshMerchants}
          // setAlertToast={setAlertToast}
        />
        <BudgetSettingsCard
          budgets={budgets}
          categories={categories}
          refreshBudgets={refreshBudgets}
          // setAlertToast={setAlertToast}
        />
      </Stack>

      <AlertToast alertToast={alertToast} />
    </Stack>
  )
}

export default Settings
