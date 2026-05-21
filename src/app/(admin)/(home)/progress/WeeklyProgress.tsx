"use client";

import { useCategoryContext } from "@/contexts/categories-context";
import { useTransactionContext } from "@/contexts/transaction-context";
import { negativeColor, positiveColor } from "@/global/colors";
import { getTransactionsByType } from "@/global/dataFunctions";
import {
  dateTypeToTimestamp,
  numberToString,
} from "@/global/formattingFunctions";
import { getCurrentDateInfo, getWeekBounds } from "@/global/infoFunctions";
import { Stack } from "@mui/material";
import { useMemo, useState } from "react";
import InfoCard from "../_components/InfoCard";
import BudgetProgressBar from "../_components/ProgressBar";
import TransactionList from "../_components/TransactionList";

const WeeklyProgress = () => {
  const { transactions } = useTransactionContext();
  const { budgetCategories } = useCategoryContext();
  const { currentMonthString, currentDay, currentYear } = getCurrentDateInfo();

  const [shownCategory, setShownCategory] = useState<string>();

  // Get the beginning and end of the week
  const { start, end } = useMemo(() => {
    return getWeekBounds({
      month: currentMonthString,
      day: currentDay,
      year: currentYear,
    });
  }, [currentMonthString, currentDay, currentYear]);

  // Filter for only expenses
  const expenseTransactions = useMemo(
    () =>
      getTransactionsByType({
        transactions: transactions,
        type: "expense",
      }),
    [transactions],
  );

  // Filter for expenses that are this week
  const thisWeeksExpenses = useMemo(() => {
    const budgetCategorySet = new Set(budgetCategories.map((b) => b.category));
    return expenseTransactions.filter((entry) => {
      if (!entry.date?.day) return false;
      if (!budgetCategorySet.has(entry.category)) return false;
      const entryTime = dateTypeToTimestamp(entry.date);
      return entryTime >= start && entryTime <= end;
    });
  }, [expenseTransactions, start, end, budgetCategories]);

  // Get total spent for each category
  const spentCategoryTotals = useMemo(() => {
    const totals = new Map<string, number>();
    thisWeeksExpenses.forEach((entry) => {
      const current = totals.get(entry.category) ?? 0;
      const value = entry.is_return ? -entry.amount : entry.amount;
      totals.set(entry.category, current + value);
    });
    return totals;
  }, [thisWeeksExpenses]);

  // Determine the remaining budget for each category
  const remainingBudget = useMemo(() => {
    return budgetCategories.map((category) => {
      const spent = spentCategoryTotals.get(category.category) ?? 0;
      return {
        id: category.id,
        category: category.category,
        amount: category.amount - spent,
      };
    });
  }, [budgetCategories, spentCategoryTotals]);

  // Get total budget amount and total spent amount
  const budgetTotal = budgetCategories.reduce((sum, c) => sum + c.amount, 0);
  const spentTotal = thisWeeksExpenses.reduce(
    (sum, t) => sum + (t.is_return ? -t.amount : t.amount),
    0,
  );

  const handleCategoryExpand = (category: string) => {
    setShownCategory((prev) => (prev === category ? undefined : category));
  };

  return (
    <Stack sx={{ width: "100%", height: "100%" }} spacing={2}>
      <BudgetProgressBar
        label={"Weekly Budget"}
        actual={spentTotal}
        budget={budgetTotal}
      />

      <Stack spacing={1}>
        {remainingBudget.map((entry) => {
          const cardColor = entry.amount < 0 ? negativeColor : positiveColor;
          return (
            <InfoCard
              key={entry.category}
              cardColors={cardColor}
              title={entry.category}
              amount={`$${numberToString(entry.amount)}`}
              onClick={() => handleCategoryExpand(entry.category)}
              moreInfo={
                shownCategory === entry.category && (
                  <TransactionList
                    expenses={thisWeeksExpenses}
                    category={entry.category}
                  />
                )
              }
            />
          );
        })}
      </Stack>
    </Stack>
  );
};

export default WeeklyProgress;
