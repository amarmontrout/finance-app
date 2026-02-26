import {
  getBudget,
  getExpenses,
  getIncome,
} from "@/app/api/Transactions/requests"
import { useUser } from "@/hooks/useUser"
import { BudgetTransactionTypeV2, TransactionTypeV2 } from "@/utils/type"
import { createContext, useContext, useEffect, useState } from "react"

type TransactionsContextType = {
  incomeTransactionsV2: TransactionTypeV2[]
  refreshIncomeTransactionsV2: () => void
  expenseTransactionsV2: TransactionTypeV2[]
  refreshExpenseTransactionsV2: () => void
  budgetTransactionsV2: BudgetTransactionTypeV2[]
  refreshBudgetTransactionsV2: () => void
  isLoading: boolean
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

  const [incomeTransactionsV2, setIncomeTransactionsV2] = useState<
    TransactionTypeV2[]
  >([])
  const [expenseTransactionsV2, setExpenseTransactionsV2] = useState<
    TransactionTypeV2[]
  >([])
  const [budgetTransactionsV2, setBudgetTransactionsV2] = useState<
    BudgetTransactionTypeV2[]
  >([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshIncomeTransactionsV2 = async () => {
    if (!user) {
      return
    }
    console.log("Pulling Income Transactions...")
    const incomeResult = await getIncome({
      userId: user.id,
    })
    setIncomeTransactionsV2(incomeResult ?? [])
  }

  const refreshExpenseTransactionsV2 = async () => {
    if (!user) {
      return
    }
    console.log("Pulling Expenses Transactions...")
    const expenseResult = await getExpenses({
      userId: user.id,
    })
    setExpenseTransactionsV2(expenseResult ?? [])
  }

  const refreshBudgetTransactionsV2 = async () => {
    if (!user) {
      return
    }
    console.log("Pulling Budget Transactions...")
    const budgetResult = await getBudget({
      userId: user.id,
    })
    setBudgetTransactionsV2(budgetResult ?? [])
  }

  useEffect(() => {
    if (!user) {
      return
    }

    const load = async () => {
      setIsLoading(true)

      await Promise.all([
        refreshIncomeTransactionsV2(),
        refreshExpenseTransactionsV2(),
        refreshBudgetTransactionsV2(),
      ])

      setIsLoading(false)
    }

    load()
  }, [user])

  return (
    <TransactionContext.Provider
      value={{
        incomeTransactionsV2,
        refreshIncomeTransactionsV2,
        expenseTransactionsV2,
        refreshExpenseTransactionsV2,
        budgetTransactionsV2,
        refreshBudgetTransactionsV2,
        isLoading,
      }}
    >
      {props.children}
    </TransactionContext.Provider>
  )
}
