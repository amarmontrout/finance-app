import { getBudget, getExpenses, getIncome } from "@/app/api/Transactions/requests"
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
  incomeLoading: boolean
  expenseLoading: boolean
  budgetLoading: boolean
}

const TransactionContext = createContext<TransactionsContextType | null>(null)

export const useTransactionContext = () => {
  const context = useContext(TransactionContext)

  if (!context) {
    throw new Error("useTransactionContext must be used within a TransactionProvider")
  }

  return context
}

export const TransactionProvider = (props: {
  children: React.ReactNode
}) => {
  const user = useUser()

  const [incomeTransactionsV2, setIncomeTransactionsV2] = 
    useState<TransactionTypeV2[]>([])
  const [expenseTransactionsV2, setExpenseTransactionsV2] = 
    useState<TransactionTypeV2[]>([])
  const [budgetTransactionsV2, setBudgetTransactionsV2] = 
    useState<BudgetTransactionTypeV2[]>([])
  const [incomeLoading, setIncomeLoading] = useState(false)
  const [expenseLoading, setExpenseLoading] = useState(false)
  const [budgetLoading, setBudgetLoading] = useState(false)

  const refreshIncomeTransactionsV2 = async () => {
    if (!user) { return }
    console.log("Pulling Income Transactions...")
    setIncomeLoading(true)
    const incomeResult = await getIncome({
      userId: user.id
    })
    setIncomeTransactionsV2(incomeResult ?? [])
    setIncomeLoading(false)
  }

  const refreshExpenseTransactionsV2 = async () => {
    if (!user) { return }
    console.log("Pulling Expenses Transactions...")
    setExpenseLoading(true)
    const expenseResult = await getExpenses({
      userId: user.id
    })
    setExpenseTransactionsV2(expenseResult ?? [])
    setExpenseLoading(false)
  }

  const refreshBudgetTransactionsV2 = async () => {
    if (!user) { return }
    console.log("Pulling Budget Transactions...")
    setBudgetLoading(true)
    const budgetResult = await getBudget({
      userId: user.id
    })
    setBudgetTransactionsV2(budgetResult ?? [])
    setBudgetLoading(false)
  }

  useEffect(() => {
    refreshIncomeTransactionsV2()
    refreshExpenseTransactionsV2()
    refreshBudgetTransactionsV2()
  }, [user])

  return (
    <TransactionContext.Provider value={{
      incomeTransactionsV2,
      refreshIncomeTransactionsV2,
      expenseTransactionsV2,
      refreshExpenseTransactionsV2,
      budgetTransactionsV2,
      refreshBudgetTransactionsV2,
      incomeLoading,
      expenseLoading,
      budgetLoading
    }}>
      {props.children}
    </TransactionContext.Provider>
  )
}