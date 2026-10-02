"use client"

import { doLogout } from "@/app/(api)/auth/requests"
import Center from "@/app/components/Center"
import PageContainer from "@/app/components/PageContainer"
import Section from "@/app/components/Section"
import AccountsCard from "@/app/components/ui/AccountsCard"
import AlertToast from "@/app/components/ui/AlertToast"
import BudgetsCard from "@/app/components/ui/BudgetsCard"
import CategoriesCard from "@/app/components/ui/CategoriesCard"
import MerchantsCard from "@/app/components/ui/MerchantsCard"
import Surface from "@/app/components/ui/Surface"
import { useDataContext } from "@/app/contexts/data-context"
import { useUser } from "@/app/lib/hooks/useUser"
import { Button, Skeleton, Stack, Typography } from "@mui/material"
import { AuthError } from "@supabase/supabase-js"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { useRouter } from "next/navigation"
import { useState } from "react"

const handleLogOut = ({ router }: { router: AppRouterInstance }) => {
  doLogout({
    router: router,
    errorHandler: (error: AuthError) => {
      console.error(error.message)
    },
  })
}

export default function Settings() {
  const { user, loading } = useUser()
  const router = useRouter()
  const {
    accounts,
    refreshAccounts,
    categories,
    refreshCategories,
    merchants,
    refreshMerchants,
    budgets,
    refreshBudgets,
    alertToast,
    setAlertToast,
  } = useDataContext()

  const [visible, setVisible] = useState<number>(0)

  return (
    <PageContainer>
      <Section>
        <Surface>
          <Section>
            <Center>
              {loading ? (
                <Skeleton width={"50%"} height={"24px"} />
              ) : (
                <Typography>{user?.email}</Typography>
              )}
            </Center>
          </Section>

          <Center>
            <Button
              variant={"contained"}
              onClick={() => handleLogOut({ router: router })}
            >
              Log Out
            </Button>
          </Center>
        </Surface>
      </Section>
      <Section>
        <Surface>
          <Stack direction={"row"}>
            <Button onClick={() => setVisible(0)}>Clear</Button>
            <Button onClick={() => setVisible(1)}>A</Button>
            <Button onClick={() => setVisible(2)}>C</Button>
            <Button onClick={() => setVisible(3)}>M</Button>
            <Button onClick={() => setVisible(4)}>B</Button>
          </Stack>
        </Surface>
      </Section>

      {visible === 1 && (
        <Surface>
          <AccountsCard
            accounts={accounts}
            refreshAccounts={refreshAccounts}
            setAlertToast={setAlertToast}
          />
        </Surface>
      )}

      {visible === 2 && (
        <Surface>
          <CategoriesCard
            categories={categories}
            accounts={accounts}
            refreshCategories={refreshCategories}
            setAlertToast={setAlertToast}
          />
        </Surface>
      )}

      {visible === 3 && (
        <Surface>
          <MerchantsCard
            categories={categories}
            merchants={merchants}
            refreshMerchants={refreshMerchants}
            setAlertToast={setAlertToast}
          />
        </Surface>
      )}

      {visible === 4 && (
        <Surface>
          <BudgetsCard
            budgets={budgets.filter((b) => b.end_month === null)}
            categories={categories}
            refreshBudgets={refreshBudgets}
            setAlertToast={setAlertToast}
          />
        </Surface>
      )}

      <AlertToast alertToast={alertToast} />
    </PageContainer>
  )
}
