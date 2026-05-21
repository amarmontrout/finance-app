import { BudgetType } from "@/api/choices/models";
import { TransactionType } from "@/api/transactions/models";
import { getTransactionsTotal } from "@/global/dataFunctions";
import { numberToString } from "@/global/formattingFunctions";
import { Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import ProgressBar from "../_components/ProgressBar";

const MonthTotalBudget = ({
  transactions,
  budgetCategories,
  currentMonth,
}: {
  transactions: TransactionType[];
  budgetCategories: BudgetType[];
  currentMonth: string;
}) => {
  const budgetTotal = budgetCategories.reduce((sum, c) => sum + c.amount, 0);
  const actualTotal = useMemo(() => {
    const allowedCategories = new Set(budgetCategories.map((c) => c.category));
    const filtered = transactions.filter((entry) =>
      allowedCategories.has(entry.category),
    );
    return getTransactionsTotal({ transactions: filtered });
  }, [transactions, budgetCategories]);
  const netTotal = budgetTotal - actualTotal;

  return (
    <Stack className="xl:w-[50%]" sx={{ margin: "0 auto" }}>
      <ProgressBar
        label={`${currentMonth}'s Budget`}
        actual={actualTotal}
        budget={budgetTotal}
      />

      {transactions.length !== 0 && (
        <Typography variant={"caption"} sx={{ textAlign: "center" }}>
          {`${netTotal < 0 ? "Overspending" : "Saving"}
          $${numberToString(Math.abs(netTotal))} for the month`}
        </Typography>
      )}
    </Stack>
  );
};

export default MonthTotalBudget;
