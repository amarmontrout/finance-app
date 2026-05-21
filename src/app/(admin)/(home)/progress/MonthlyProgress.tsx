"use client";

import { useTransactionContext } from "@/contexts/transaction-context";
import { negativeColor, positiveColor } from "@/global/colors";
import { getTransactionsByType } from "@/global/dataFunctions";
import { numberToString } from "@/global/formattingFunctions";
import { getBudgetInfo, getCurrentDateInfo } from "@/global/infoFunctions";
import { Stack } from "@mui/material";
import { useMemo, useState } from "react";
import InfoCard from "../_components/InfoCard";
import TransactionList from "../_components/TransactionList";
import MonthTotalBudget from "./MonthTotalBudget";

const budgetExamplesForTesting = [
  {
    id: 1,
    category: "Fast Food",
    amount: 125,
  },
  {
    id: 2,
    category: "Groceries",
    amount: 850,
  },
  {
    id: 3,
    category: "Restaurant",
    amount: 375,
  },
  {
    id: 4,
    category: "Shopping",
    amount: 350,
  },
  {
    id: 5,
    category: "Travel",
    amount: 300,
  },
  {
    id: 6,
    category: "Misc",
    amount: 100,
  },
  {
    id: 7,
    category: "Car",
    amount: 50,
  },
  {
    id: 8,
    category: "Entertainment",
    amount: 100,
  },
  {
    id: 9,
    category: "Gas",
    amount: 120,
  },
];

const MonthlyProgress = () => {
  const { transactions } = useTransactionContext();
  const { currentMonthString, currentDay, currentYear } = getCurrentDateInfo();

  const [shownCategory, setShownCategory] = useState<string>();

  // Filter for this month's expenses
  const thisMonthsExpenses = useMemo(
    () =>
      getTransactionsByType({
        transactions: transactions,
        type: "expense",
        month: currentMonthString,
        year: currentYear,
      }),
    [transactions],
  );

  // Get total spent for each category
  const spentCategoryTotals = useMemo(() => {
    const totals = new Map<string, number>();
    thisMonthsExpenses.forEach((entry) => {
      const current = totals.get(entry.category) ?? 0;
      const value = entry.is_return ? -entry.amount : entry.amount;
      totals.set(entry.category, current + value);
    });
    return totals;
  }, [thisMonthsExpenses]);

  // Determine the remaining budget for each category
  const remainingCategoryBudget = useMemo(() => {
    return budgetExamplesForTesting.map((category) => {
      const spent = spentCategoryTotals.get(category.category) ?? 0;
      return {
        id: category.id,
        category: category.category,
        amount: category.amount - spent,
      };
    });
  }, [budgetExamplesForTesting, spentCategoryTotals]);

  const { actualTotal, budgetTotal } = useMemo(() => {
    let actual = 0;

    const allowedCategories = new Set(
      budgetExamplesForTesting.map((c) => c.category),
    );

    const budget = budgetExamplesForTesting.reduce(
      (sum, c) => sum + c.amount,
      0,
    );

    for (const t of thisMonthsExpenses) {
      if (allowedCategories.has(t.category)) {
        actual += t.is_return ? -t.amount : t.amount;
      }
    }

    return { actualTotal: actual, budgetTotal: budget };
  }, [
    thisMonthsExpenses,
    budgetExamplesForTesting,
    currentMonthString,
    currentYear,
  ]);

  const { remainingDays, remainingBudget, earnedBudget, budgetLeftToEarn } =
    getBudgetInfo({
      monthlyBudget: budgetTotal,
      spentSoFar: actualTotal,
      date: { month: currentMonthString, day: currentDay, year: currentYear },
    });

  const handleExpandCategory = (category: string) => {
    setShownCategory((prev) => (prev === category ? undefined : category));
  };

  return (
    <Stack sx={{ width: "100%", height: "100%" }} spacing={1}>
      <MonthTotalBudget
        transactions={thisMonthsExpenses}
        budgetCategories={budgetExamplesForTesting}
        currentMonth={currentMonthString}
      />

      <Stack spacing={0.5}>
        {remainingCategoryBudget.map((entry) => {
          const cardColor = entry.amount < 0 ? negativeColor : positiveColor;
          return (
            <InfoCard
              key={entry.category}
              cardColors={cardColor}
              title={entry.category}
              amount={`$${numberToString(entry.amount)}`}
              onClick={() => handleExpandCategory(entry.category)}
              moreInfo={
                shownCategory === entry.category && (
                  <TransactionList
                    expenses={thisMonthsExpenses}
                    category={entry.category}
                  />
                )
              }
            />
          );
        })}
      </Stack>

      {/* <Stack
        spacing={1}
        divider={<Divider sx={{ borderColor: neutralColor.color }} />}
      >
        <Typography>{`Remaining Days: ${remainingDays}`}</Typography>
        <Typography>
          {`Remaining Budget: $${numberToString(remainingBudget)}`}
        </Typography>
        <Typography>
          {`Earned Budget: $${numberToString(earnedBudget)}`}
        </Typography>
        <Typography>
          {`Remaining Budget To Earn: $${numberToString(budgetLeftToEarn)}`}
        </Typography>
      </Stack> */}
    </Stack>
  );
};

export default MonthlyProgress;
