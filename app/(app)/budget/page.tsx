"use client"

import { BudgetType } from "@/app/(api)/budgets/models"
import { TransactionType } from "@/app/(api)/transactions/models"
import AllDialogs from "@/app/components/AllDialogs"
import Center from "@/app/components/Center"
import PageContainer from "@/app/components/PageContainer"
import Section from "@/app/components/Section"
import AlertToast from "@/app/components/ui/AlertToast"
import MonthYearSelector from "@/app/components/ui/MonthYearSelector"
import Surface from "@/app/components/ui/Surface"
import { useDataContext } from "@/app/contexts/data-context"
import { useTransactionContext } from "@/app/contexts/transaction-context"
import { TEXT_COLOR } from "@/app/data/colors"
import { getDateRange, getISOMonth } from "@/app/lib/functions/getters"
import { HookSetter } from "@/app/lib/types"
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded"
import { CircularProgress, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import CategoryBudgetSection from "./CategoryBudgetSection"

const AddCategoryBudgetSection = ({
  categoryName,
  setOpenAddBudget,
}: {
  categoryName: string
  setOpenAddBudget: HookSetter<boolean>
}) => {
  return (
    <Section>
      <Surface>
        <Stack
          direction={"row"}
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant={"h6"}
            sx={{ alignSelf: "flex-end", lineHeight: 1 }}
          >
            {categoryName}
          </Typography>
          <Typography
            variant={"body2"}
            onClick={() => setOpenAddBudget(true)}
            sx={{
              gap: 0.5,
              color: TEXT_COLOR,
              lineHeight: 1,
            }}
          >
            Set a budget
            <ArrowForwardIosRoundedIcon sx={{ fontSize: 12 }} />
          </Typography>
        </Stack>
      </Surface>
    </Section>
  )
}

export default function Budget() {
  const { selectedDate, transactions, alertToast, isTransactionsLoading } =
    useTransactionContext()

  const { startOfMonth } = getDateRange(selectedDate)
  const { budgets, categoryMap, setOpenAddBudget, isDataContextLoading } =
    useDataContext()
  const isLoading = isTransactionsLoading || isDataContextLoading
  const isCurrentMonth = startOfMonth === getISOMonth()

  const [expandedCategory, setExpandedCategory] = useState<string>()

  const selectedDateBudgets = useMemo(() => {
    return budgets.filter(
      (budget) =>
        budget.start_month <= startOfMonth &&
        (budget.end_month === null || budget.end_month >= startOfMonth),
    )
  }, [budgets, startOfMonth])

  const budgetLookup = useMemo(() => {
    return selectedDateBudgets.reduce(
      (acc, budget) => {
        acc[budget.category_id] = budget
        return acc
      },
      {} as Record<string, BudgetType>,
    )
  }, [selectedDateBudgets])

  const paidExpenses = useMemo(() => {
    return transactions.filter(
      (transaction) =>
        transaction.transaction_type === "Expense" && transaction.is_paid,
    )
  }, [transactions])

  const categoryTransactions = useMemo(() => {
    return paidExpenses.reduce<Record<string, TransactionType[]>>(
      (groups, transaction) => {
        const category = transaction.category_id
        groups[category] ??= []
        groups[category].push(transaction)
        return groups
      },
      {},
    )
  }, [paidExpenses])

  return (
    <PageContainer>
      <Section>
        <Surface>
          <MonthYearSelector showMonth={true} showYearButtons={false} />
        </Surface>
      </Section>

      <Surface>
        {isLoading ? (
          <Center>
            <CircularProgress />
          </Center>
        ) : (
          <Stack direction={"column"} spacing={1}>
            {!paidExpenses.length ? (
              <Center>
                <Typography>No paid expenses for this month</Typography>
              </Center>
            ) : (
              Object.entries(categoryTransactions)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([categoryId, entries]) => {
                  const budget = budgetLookup[categoryId]

                  if (budget === undefined) {
                    if (!isCurrentMonth) {
                      return null
                    }

                    return (
                      <AddCategoryBudgetSection
                        key={categoryId}
                        categoryName={categoryMap.get(categoryId)?.name ?? ""}
                        setOpenAddBudget={setOpenAddBudget}
                      />
                    )
                  }

                  return (
                    <CategoryBudgetSection
                      key={categoryId}
                      entries={entries}
                      budget={budget}
                      expandedCategory={expandedCategory}
                      setExpandedCategory={setExpandedCategory}
                      categoryId={categoryId}
                      isCurrentMonth={isCurrentMonth}
                      budgetLookup={budgetLookup}
                    />
                  )
                })
            )}
          </Stack>
        )}
      </Surface>

      <AlertToast alertToast={alertToast} />
      <AllDialogs />
    </PageContainer>
  )
}
