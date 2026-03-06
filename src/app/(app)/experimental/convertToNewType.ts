import { saveTransaction } from "@/app/api/Transactions/requests"
import { makeId } from "@/utils/helperFunctions"
import { 
  BudgetTransactionType, 
  NewTransactionType, 
  TransactionType 
} from "@/utils/type"
import { User } from "@supabase/supabase-js"

const migrateIncomeTransaction = (
  old: TransactionType,
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
  old: TransactionType,
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
  old: BudgetTransactionType, 
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
  incomeTransactions: TransactionType[]
) => {
  if (!user) return
  for (const [i, oldTx] of incomeTransactions.entries()) {
    const t = migrateIncomeTransaction(oldTx, "income")
    try {
      await saveTransaction({
        userId: user.id,
        body: t,
      })
      console.log(`Migrated ${i + 1}/${incomeTransactions.length}`)
    } catch (err) {
      console.error("Migration failed:", t, err)
    }
  }
  console.log("Income migration complete")
}

export const migrateAllExpenses = async (
  user: User, 
  expenseTransactions: TransactionType[]
) => {
  if (!user) return
  for (const [i, oldTx] of expenseTransactions.entries()) {
    const t = migrateExpenseTransaction(oldTx, "expense")
    try {
      await saveTransaction({
        userId: user.id,
        body: t,
      })
      console.log(`Migrated ${i + 1}/${expenseTransactions.length}`)
    } catch (err) {
      console.error("Migration failed:", t, err)
    }
  }
  console.log("Expense migration complete")
}

export const migrateAllBudget = async (
  user: User, 
  budgetTransactions: BudgetTransactionType[]
) => {
  if (!user) return
  for (const [i, oldTx] of budgetTransactions.entries()) {
    const t = migrateBudgetTransaction(oldTx)
    try {
      await saveTransaction({
        userId: user.id,
        body: t,
      })
      console.log(`Migrated ${i + 1}/${budgetTransactions.length}`)
    } catch (err) {
      console.error("Migration failed:", t, err)
    }
  }
  console.log("Expense migration complete")
}