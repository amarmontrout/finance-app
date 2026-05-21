import { TransactionType } from "@/api/transactions/models";

export const getTransactionsByType = ({
  transactions,
  type,
  month,
  year,
}: {
  transactions: TransactionType[];
  type: "income" | "expense";
  month?: string;
  year?: number;
}) => {
  return transactions.filter((transaction) => {
    if (transaction.type !== type) return false;
    if (month && transaction.date.month !== month) return false;
    if (year !== undefined && transaction.date.year !== year) return false;

    return true;
  });
};

export const getTransactionsByDate = ({
  transactions,
  month,
  year,
}: {
  transactions: TransactionType[];
  month: string;
  year: number;
}) => {
  return transactions.filter((transaction) => {
    if (month && transaction.date.month !== month) return false;
    if (year !== undefined && transaction.date.year !== year) return false;

    return true;
  });
};

export const getExpenseTransactionsByPaymentMethod = ({
  transactions,
  paymentMethod,
  month,
  year,
}: {
  transactions: TransactionType[];
  paymentMethod: "Debit" | "Credit";
  month?: string;
  year?: number;
}) => {
  return transactions.filter((transaction) => {
    if (transaction.payment_method !== paymentMethod) return false;
    if (transaction.type !== "expense") return false;
    if (month && transaction.date.month !== month) return false;
    if (year && transaction.date.year !== year) return false;
    return true;
  });
};

export const getTransactionsTotal = ({
  transactions,
}: {
  transactions: TransactionType[];
}) => {
  return transactions.reduce(
    (total, transaction) =>
      total +
      (transaction.is_return ? -transaction.amount : transaction.amount),
    0,
  );
};
