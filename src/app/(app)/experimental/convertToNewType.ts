import { saveTransaction } from "@/app/api/Transactions/requests"
import { makeId } from "@/utils/helperFunctions"
import { 
  BudgetTransactionTypeV2, 
  NewTransactionType, 
  TransactionTypeV2 
} from "@/utils/type"
import { User } from "@supabase/supabase-js"

const migrateIncomeTransaction = (
  old: TransactionTypeV2,
  type: "income",
): NewTransactionType => {
  return {
    id: makeId(),
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

const migrateExpenseTransaction = (
  old: TransactionTypeV2,
  type: "expense",
): NewTransactionType => {
  return {
    id: makeId(),
    date: {
      month: old.month,
      day: 0,
      year: old.year,
    },
    amount: old.amount,
    category: old.category,
    note: "",
    payment_method: old.category === "Water" ? "Credit" : "Debit",
    type,
    is_paid: old.isPaid ?? false,
    is_return: false,
  }
}

const migrateBudgetTransaction = ( 
  old: BudgetTransactionTypeV2, 
): NewTransactionType => { 
  return { 
    id: makeId(),
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

export const migrateAllIncome = async (
  user: User, 
  incomeTransactionsV2: TransactionTypeV2[]
) => {
  if (!user) return
  for (const [i, oldTx] of incomeTransactionsV2.entries()) {
    const t = migrateIncomeTransaction(oldTx, "income")
    try {
      await saveTransaction({
        userId: user.id,
        body: t,
      })
      console.log(`Migrated ${i + 1}/${incomeTransactionsV2.length}`)
    } catch (err) {
      console.error("Migration failed:", t, err)
    }
  }
  console.log("Income migration complete")
}

export const migrateAllExpenses = async (
  user: User, 
  expenseTransactionsV2: TransactionTypeV2[]
) => {
  if (!user) return
  for (const [i, oldTx] of expenseTransactionsV2.entries()) {
    const t = migrateExpenseTransaction(oldTx, "expense")
    try {
      await saveTransaction({
        userId: user.id,
        body: t,
      })
      console.log(`Migrated ${i + 1}/${expenseTransactionsV2.length}`)
    } catch (err) {
      console.error("Migration failed:", t, err)
    }
  }
  console.log("Expense migration complete")
}

export const migrateAllBudget = async (
  user: User, 
  budgetTransactionsV2: BudgetTransactionTypeV2[]
) => {
  if (!user) return
  for (const [i, oldTx] of budgetTransactionsV2.entries()) {
    const t = migrateBudgetTransaction(oldTx)
    try {
      await saveTransaction({
        userId: user.id,
        body: t,
      })
      console.log(`Migrated ${i + 1}/${budgetTransactionsV2.length}`)
    } catch (err) {
      console.error("Migration failed:", t, err)
    }
  }
  console.log("Expense migration complete")
}