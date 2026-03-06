import {
  getBudget,
  getExpenses,
  getIncome,
  getTransactions,
} from "@/app/api/Transactions/requests"
import { useUser } from "@/hooks/useUser"
import {
  BudgetTransactionType,
  NewTransactionType,
  TransactionType,
} from "@/utils/type"
import { createContext, useContext, useEffect, useState } from "react"

type TransactionsContextType = {
  incomeTransactions: TransactionType[]
  refreshIncomeTransactions: () => void
  expenseTransactions: TransactionType[]
  refreshExpenseTransactions: () => void
  budgetTransactions: BudgetTransactionType[]
  refreshBudgetTransactions: () => void
  isLoading: boolean
  transactions: NewTransactionType[]
  refreshTransactions: () => Promise<void>
}

const TransactionContext = createContext<TransactionsContextType | null>(null)

export const useTransactionContext = () => {
  const context = useContext(TransactionContext)

  if (!context) {
    throw new Error(
      "useTransactionContext must be used within a TransactionProvider",
    )
  }

  return context
}

export const TransactionProvider = (props: { children: React.ReactNode }) => {
  const user = useUser()
  const [transactions, setTransactions] = useState<NewTransactionType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const refreshTransactions = async () => {
    if (!user) {
      return
    }
    console.log("Pulling Transactions...")
    const result = await getTransactions({
      userId: user.id,
    })
    setTransactions(result ?? [])
  }
  //////////////////////////////////////////////////////////////////////////////
  const [incomeTransactions, setIncomeTransactions] = useState<
    TransactionType[]
  >([])
  const [expenseTransactions, setExpenseTransactions] = useState<
    TransactionType[]
  >([])
  const [budgetTransactions, setBudgetTransactions] = useState<
    BudgetTransactionType[]
  >([])
  const refreshIncomeTransactions = async () => {
    if (!user) {
      return
    }
    console.log("Pulling Income Transactions...")
    const incomeResult = await getIncome({
      userId: user.id,
    })
    setIncomeTransactions(incomeResult ?? [])
  }
  const refreshExpenseTransactions = async () => {
    if (!user) {
      return
    }
    console.log("Pulling Expenses Transactions...")
    const expenseResult = await getExpenses({
      userId: user.id,
    })
    setExpenseTransactions(expenseResult ?? [])
  }
  const refreshBudgetTransactions = async () => {
    if (!user) {
      return
    }
    console.log("Pulling Budget Transactions...")
    const budgetResult = await getBudget({
      userId: user.id,
    })
    setBudgetTransactions(budgetResult ?? [])
  }
  const loadTransactions = async () => {
    if (!user) return
    setIsLoading(true)
    await Promise.all([
      refreshTransactions(),
      refreshIncomeTransactions(),
      refreshExpenseTransactions(),
      refreshBudgetTransactions(),
    ])
    setIsLoading(false)
  }

  useEffect(() => {
    if (user) {
      loadTransactions()
    }
  }, [user])

  return (
    <TransactionContext.Provider
      value={{
        incomeTransactions,
        refreshIncomeTransactions,
        expenseTransactions,
        refreshExpenseTransactions,
        budgetTransactions,
        refreshBudgetTransactions,
        isLoading,
        transactions,
        refreshTransactions,
      }}
    >
      {props.children}
    </TransactionContext.Provider>
  )
}
