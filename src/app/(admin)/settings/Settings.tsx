"use client";

import { ChoiceType } from "@/api/choices/models";
import { saveBudgetCategory } from "@/api/choices/requests";
import { useCategoryContext } from "@/contexts/categories-context";
import AlertToast from "@/global/components/AlertToast";
import { makeId } from "@/global/infoFunctions";
import { AlertToastType } from "@/types/types";
import { Stack, Typography } from "@mui/material";
import { useState } from "react";
import AddExpenseCategory from "./_components/AddExpenseCategory";
import AddIncomeCategory from "./_components/AddIncomeCategory";
import AddYear from "./_components/AddYear";
import EditCategorySettingsDialog from "./_components/EditCategorySettingsDialog";

const Settings = () => {
  const {
    incomeCategories,
    expenseCategories,
    budgetCategories,
    years,
    loadCategories,
  } = useCategoryContext();

  const [choice, setChoice] = useState<ChoiceType | null>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState<boolean>(false);
  const [alertToast, setAlertToast] = useState<AlertToastType>();

  const syncExpenseToBudget = async (expenseName: string, userId: string) => {
    const exists = budgetCategories.some((b) => b.category === expenseName);

    if (!exists) {
      await saveBudgetCategory({
        userId: userId,
        body: {
          id: makeId(),
          category: expenseName,
          amount: 50,
        },
      });
      await loadCategories();
    }
  };

  return (
    <Stack direction={"column"} spacing={3}>
      <Typography variant={"h5"} sx={{ width: "100%", textAlign: "Center" }}>
        Settings
      </Typography>

      <Stack direction={"column"}>
        <AddYear
          years={years}
          loadCategories={loadCategories}
          setAlertToast={setAlertToast}
        />

        <AddIncomeCategory
          incomeCategories={incomeCategories}
          loadCategories={loadCategories}
          setAlertToast={setAlertToast}
        />

        <AddExpenseCategory
          setCategoryDialogOpen={setCategoryDialogOpen}
          setChoice={setChoice}
          expenseCategories={expenseCategories}
          loadCategories={loadCategories}
          syncExpenseToBudget={syncExpenseToBudget}
          setAlertToast={setAlertToast}
        />
      </Stack>

      <EditCategorySettingsDialog
        categoryDialogOpen={categoryDialogOpen}
        setCategoryDialogOpen={setCategoryDialogOpen}
        choice={choice}
        refresh={loadCategories}
        setAlertToast={setAlertToast}
      />

      <AlertToast alertToast={alertToast} />
    </Stack>
  );
};

export default Settings;
