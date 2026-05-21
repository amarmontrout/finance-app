"use client";

import { TransactionType } from "@/api/transactions/models";
import { useCategoryContext } from "@/contexts/categories-context";
import { useTransactionContext } from "@/contexts/transaction-context";
import AddDataButton from "@/global/components/AddDataButton";
import AddEditDialog from "@/global/components/AddEditDialog";
import AlertToast from "@/global/components/AlertToast";
import MonthYearSelector from "@/global/components/MonthYearSelector";
import { getTransactionsByDate } from "@/global/dataFunctions";
import { getCurrentDateInfo } from "@/global/infoFunctions";
import { AlertToastType, SelectedDateType } from "@/types/types";
import { Stack } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import TransactionsDisplay from "./TransactionsDisplay";

const Transactions = () => {
  const { isLoading, transactions, refreshTransactions } =
    useTransactionContext();
  const { incomeCategories, expenseCategories } = useCategoryContext();
  const { currentYear, currentMonthString } = getCurrentDateInfo();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const CURRENT_DATE = {
    month: currentMonthString,
    year: currentYear,
  };

  const [selectedDate, setSelectedDate] =
    useState<SelectedDateType>(CURRENT_DATE);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [alertToast, setAlertToast] = useState<AlertToastType>();
  const [type, setType] = useState<"income" | "expense">("income");
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionType | null>(null);

  const resetSelectedDate = () => {
    setSelectedDate(CURRENT_DATE);
  };

  const monthTransactions = useMemo(() => {
    return getTransactionsByDate({
      transactions: transactions,
      month: selectedDate.month,
      year: selectedDate.year,
    });
  }, [transactions, selectedDate]);

  return (
    <Stack direction={"column"}>
      <MonthYearSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        resetSelectedDate={resetSelectedDate}
        showMonth={true}
      />

      <TransactionsDisplay
        transactions={monthTransactions}
        refreshTransactions={refreshTransactions}
        type={type}
        setType={setType}
        selectedDate={selectedDate}
        setAlertToast={setAlertToast}
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={setSelectedTransaction}
        isLoading={isLoading}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />

      <AddEditDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        setAlertToast={setAlertToast}
        incomeCategories={incomeCategories}
        expenseCategories={expenseCategories}
        inputRef={inputRef}
        refreshTransactions={refreshTransactions}
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={setSelectedTransaction}
        transactions={transactions}
        type={type}
        setType={setType}
      />

      <AlertToast alertToast={alertToast} />

      <AddDataButton
        action={() => {
          setOpenDialog(true);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 50);
        }}
      />
    </Stack>
  );
};

export default Transactions;
