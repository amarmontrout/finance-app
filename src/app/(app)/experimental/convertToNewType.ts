import { makeId } from "@/utils/helperFunctions"
import { 
  BudgetTransactionTypeV2, 
  NewTransactionType, 
  TransactionTypeV2 
} from "@/utils/type"

export const migrateIncomeTransaction = (
  old: TransactionTypeV2,
  type: "income",
): NewTransactionType => {
  return {
    id: makeId(10),
    date: {
      month: old.month,
      day: 0,
      year: old.year,
    },
    amount: old.amount,
    category: old.category,
    note: "",
    payment_method: "",
    type,
    is_paid: old.isPaid ?? false,
    is_return: false,
  }
}

export const migrateExpenseTransaction = (
  old: TransactionTypeV2,
  type: "expense",
): NewTransactionType => {
  return {
    id: makeId(10),
    date: {
      month: old.month,
      day: 0,
      year: old.year,
    },
    amount: old.amount,
    category: old.category,
    note: "",
    payment_method: "Debit",
    type,
    is_paid: old.isPaid ?? false,
    is_return: false,
  }
}

export const migrateBudgetTransaction = ( 
  old: BudgetTransactionTypeV2, 
): NewTransactionType => { 
  return { 
    id: makeId(10),
    date: old.date, 
    amount: old.amount, 
    category: old.category, 
    note: old.note, 
    payment_method: "Credit", 
    type: "expense", 
    is_paid: true, 
    is_return: old.isReturn ?? false, 
  } 
}