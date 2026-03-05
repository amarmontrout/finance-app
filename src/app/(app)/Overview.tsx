"use client"

import { useCategoryContext } from "@/contexts/categories-context"
import { useTransactionContext } from "@/contexts/transactions-context"
import {
  formattedStringNumber,
  getCardColor,
  getCurrentDateInfo,
  getSavingsHealthState,
  getWeekBounds,
} from "@/utils/helperFunctions"
import { useTheme } from "next-themes"
import { useEffect, useMemo, useState } from "react"
import YearTotals from "./YearTotals"
import RemainingBudget from "./RemainingBudget"
import TopThreeExpenses from "./TopThreeCategories"
import SetUpDialog from "./SetUpDialog"
import { Stack, Typography } from "@mui/material"
import ShowCaseCard from "@/components/ShowCaseCard"
import LoadingCircle from "@/components/LoadingCircle"
import { FlexColWrapper } from "@/components/Wrappers"
import ColoredInfoCard from "@/components/ColoredInfoCard"
import {
  getMonthCategoryTotals,
  getTotalsForMonthNetCash,
} from "./experimental/functions"
import { getNetCashFlow } from "@/utils/financialFunctions"
import BudgetProgressBar from "./budget/BudgetProgressBar"
import { BudgetTypeV2, DateType } from "@/utils/type"

const Overview = () => {
  const {
    incomeTransactionsV2,
    expenseTransactionsV2,
    budgetTransactionsV2,
    transactions,
  } = useTransactionContext()
  const {
    excludedSet,
    budgetCategoriesV2,
    incomeCategoriesV2,
    expenseCategoriesV2,
    yearsV2,
    loadCategories,
    isLoading,
  } = useCategoryContext()
  const { currentYear, currentDay, currentMonth } = getCurrentDateInfo()
  const { theme: currentTheme } = useTheme()

  const [setUpDialogOpen, setSetUpDialogOpen] = useState<boolean>(false)

  useEffect(() => {
    if (isLoading) return

    if (
      yearsV2.length === 0 &&
      incomeCategoriesV2.length === 0 &&
      expenseCategoriesV2.length === 0
    ) {
      setSetUpDialogOpen(true)
    }
  }, [isLoading, yearsV2, incomeCategoriesV2, expenseCategoriesV2])
  //////////////////////////////////////////////////////////////////////////////
  //MONTHLY SUMMARY V2
  const defaultCardColor = getCardColor(currentTheme, "default")
  const positiveCardColor = getCardColor(currentTheme, "great")
  const negativeCardColor = getCardColor(currentTheme, "concerning")
  const { incomeTotalMonthNet, expenseTotalMonthNet } =
    getTotalsForMonthNetCash(currentYear, currentMonth, transactions)

  const annualNetIncome = getNetCashFlow(
    incomeTotalMonthNet,
    expenseTotalMonthNet,
  )
  const savingsHealthState = getSavingsHealthState(
    annualNetIncome,
    incomeTotalMonthNet,
  )
  const savingsColor = getCardColor(currentTheme, savingsHealthState)
  const hasNet = annualNetIncome !== 0
  const netTitle = `${currentMonth} Net Cash${
    hasNet ? ` (${savingsHealthState.toUpperCase()})` : ""
  }`
  /////////////////////////////////         ////////////////////////////////////
  //WEEKLY BUDGET V2
  const { start, end } = useMemo(() => {
    return getWeekBounds({
      month: currentMonth,
      day: currentDay,
      year: currentYear,
    })
  }, [])

  const weeklyTransactions = useMemo(() => {
    const toDate = (date: DateType) => {
      const monthIndex = new Date(`${date.month} 1, ${date.year}`).getMonth()
      return new Date(date.year, monthIndex, date.day)
    }

    const weekStart = toDate(start)
    const weekEnd = toDate(end)

    const budgetCategorySet = new Set(budgetCategoriesV2.map((b) => b.category))

    return transactions
      .filter((entry) => entry.type === "expense")
      .filter((entry) => budgetCategorySet.has(entry.category ?? ""))
      .filter((entry) => {
        if (!entry.date?.day) return false
        const entryDate = toDate(entry.date)
        return entryDate >= weekStart && entryDate <= weekEnd
      })
  }, [transactions, start, end, budgetCategoriesV2])

  const categoryTotals = useMemo(() => {
    const totals = new Map<string, number>()

    weeklyTransactions.forEach((entry) => {
      const current = totals.get(entry.category ?? "") ?? 0
      const value = entry.is_return ? -entry.amount : entry.amount
      totals.set(entry.category ?? "", current + value)
    })

    return totals
  }, [weeklyTransactions])

  const remainingBudgetCategories = useMemo(() => {
    return budgetCategoriesV2.map((category) => {
      const spent = categoryTotals.get(category.category) ?? 0

      return {
        id: category.id,
        category: category.category,
        amount: category.amount - spent,
      }
    })
  }, [budgetCategoriesV2, categoryTotals])

  const budgetTotal = budgetCategoriesV2.reduce((sum, c) => sum + c.amount, 0)
  const actualTotal = weeklyTransactions.reduce(
    (sum, t) => sum + (t.is_return ? -t.amount : t.amount),
    0,
  )
  /////////////////////////////////         ////////////////////////////////////
  //TOP THREE
  const topThreeData = useMemo(() => {
    const monthExpenseCategoryTotals = getMonthCategoryTotals(
      currentYear,
      currentMonth,
      transactions,
    )
    if (!monthExpenseCategoryTotals || monthExpenseCategoryTotals.length <= 1) {
      return {
        topThree: [] as [string, number][],
        topThreeSum: 0,
        monthTotal: 0,
        topThreeTotalPercent: 0,
      }
    }
    const topThree = monthExpenseCategoryTotals
      .slice(1)
      .sort((a, b) => Number(b[1]) - Number(a[1]))
      .slice(0, 3) as [string, number][]
    const topThreeSum = topThree.reduce((sum, [, amount]) => sum + amount, 0)
    return {
      topThree,
      topThreeSum,
    }
  }, [currentYear, currentMonth, expenseTransactionsV2, excludedSet])

  const { topThree, topThreeSum } = topThreeData
  //////////////////////////////////////////////////////////////////////////////

  return (
    <Stack spacing={1}>
      <YearTotals
        currentYear={currentYear}
        currentMonth={currentMonth}
        currentTheme={currentTheme}
        excludedSet={excludedSet}
        incomeTransactionsV2={incomeTransactionsV2}
        expenseTransactionsV2={expenseTransactionsV2}
        isLoading={isLoading}
      />

      {/* <ShowCaseCard title={"Monthly Summary V2"}>
        {isLoading ? (
          <LoadingCircle />
        ) : (
          <FlexColWrapper gap={2} toRowBreak={"xl"}>
            <ColoredInfoCard
              cardColors={defaultCardColor}
              info={`$${formattedStringNumber(incomeTotalMonthNet)}`}
              title={`${currentMonth} Income`}
            />
            <ColoredInfoCard
              cardColors={defaultCardColor}
              info={`$${formattedStringNumber(expenseTotalMonthNet)}`}
              title={`${currentMonth} Expenses`}
            />
            <ColoredInfoCard
              cardColors={savingsColor}
              info={`$${formattedStringNumber(annualNetIncome)}`}
              title={netTitle}
            />
          </FlexColWrapper>
        )}
      </ShowCaseCard> */}

      <RemainingBudget
        budgetCategoriesV2={budgetCategoriesV2}
        budgetTransactionsV2={budgetTransactionsV2}
        currentTheme={currentTheme}
        currentMonth={currentMonth}
        currentDay={currentDay}
        currentYear={currentYear}
        isLoading={isLoading}
      />

      {/* <ShowCaseCard title={""}>
        {isLoading ? (
          <LoadingCircle />
        ) : (
          <Stack spacing={1.5}>
            <BudgetProgressBar
              label={"Weekly Budget V2"}
              actual={actualTotal}
              budget={budgetTotal}
            />
            <FlexColWrapper gap={2} toRowBreak={"xl"}>
              {remainingBudgetCategories.length === 0 ? (
                <Typography width={"100%"} textAlign={"center"}>
                  Set up your budget in settings
                </Typography>
              ) : (
                remainingBudgetCategories.map((entry) => {
                  const category = entry.category
                  const remaining = entry.amount
                  const cardColor =
                    remaining < 0 ? negativeCardColor : positiveCardColor

                  return (
                    <ColoredInfoCard
                      key={category}
                      cardColors={cardColor}
                      title={category}
                      info={`$${formattedStringNumber(remaining)}`}
                    />
                  )
                })
              )}
            </FlexColWrapper>
          </Stack>
        )}
      </ShowCaseCard> */}

      <TopThreeExpenses
        expenseTransactionsV2={expenseTransactionsV2}
        excludedSet={excludedSet}
        isLoading={isLoading}
      />

      {/* <ShowCaseCard title={`Top Monthly Expenses V2`}>
        {isLoading ? (
          <LoadingCircle />
        ) : (
          <Stack spacing={2}>
            <FlexColWrapper gap={2} toRowBreak={"xl"}>
              {topThree.map(([category, amount], idx) => (
                <ColoredInfoCard
                  key={category}
                  cardColors={defaultCardColor}
                  info={`$${formattedStringNumber(Number(amount))}`}
                  title={`${idx + 1}) ${category}`}
                />
              ))}
            </FlexColWrapper>
            {topThree.length !== 0 ? (
              <Typography variant={"h6"} width={"100%"} textAlign={"center"}>
                {`A total of $${formattedStringNumber(topThreeSum)}`}
              </Typography>
            ) : (
              <Typography width={"100%"} textAlign={"center"}>
                Enter your expenses in transactions
              </Typography>
            )}
          </Stack>
        )}
      </ShowCaseCard> */}

      <SetUpDialog
        setUpDialogOpen={setUpDialogOpen}
        setSetUpDialogOpen={setSetUpDialogOpen}
        currentYear={currentYear}
        loadCategories={loadCategories}
      />
    </Stack>
  )
}

export default Overview
