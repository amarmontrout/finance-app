import { getBudget, getExpenses, getIncome } from "@/app/api/Transactions/requests"
import { EXPENSES, INCOME } from "@/globals/globals"
import { mockExpenseData, mockIncomeData } from "@/globals/mockData"
import { useUser } from "@/hooks/useUser"
import { flattenTransactions } from "@/utils/helperFunctions"
import { getTransactions, TransactionData } from "@/utils/transactionStorage"
import { BudgetTransactionTypeV2, TransactionTypeV2 } from "@/utils/type"
import { createContext, useContext, useEffect, useState } from "react"

type TransactionsContextType = {
  incomeTransactions: TransactionData
  flatIncomeTransactions: FlatTransaction[]
  expenseTransactions: TransactionData
  flatExpenseTransactions: FlatTransaction[]
  refreshIncomeTransactions: () => void
  refreshExpenseTransactions: () => void
  isMockData: MockDataType

  incomeTransactionsV2: TransactionTypeV2[]
  refreshIncomeTransactionsV2: () => void
  expenseTransactionsV2: TransactionTypeV2[]
  refreshExpenseTransactionsV2: () => void
  budgetTransactionsV2: BudgetTransactionTypeV2[]
  refreshBudgetTransactionsV2: () => void
}

type MockDataType = {
  years: boolean
  income: boolean
  incomeCategories: boolean
  expenses: boolean
  expensesCategories: boolean
}

export type FlatTransaction = {
  id: string
  year: string
  month: string
  category: string
  amount: string
}

const mockDataInit = {
  years: false,
  income: false,
  incomeCategories: false,
  expenses: false,
  expensesCategories: false
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
  const [incomeTransactions, setIncomeTransactions] = 
    useState<TransactionData>({})
  const [flatIncomeTransactions, setFlatIncomeTransactions] = 
    useState<FlatTransaction[]>([])
  const [expenseTransactions, setExpenseTransactions] = 
    useState<TransactionData>({})
  const [flatExpenseTransactions, setFlatExpenseTransactions] = 
    useState<FlatTransaction[]>([])
  const [isMockData, setIsMockData] = useState<MockDataType>(mockDataInit)

  const refreshIncomeTransactions = () => {
    const localIncomeData = getTransactions({key: INCOME})
    if (!localIncomeData || Object.keys(localIncomeData).length === 0) {
      setIsMockData(prev => ({...prev, income: true}))
      setIncomeTransactions(mockIncomeData)
    } else {
      setIsMockData(prev => ({...prev, income: false}))
      setIncomeTransactions(localIncomeData)
      setFlatIncomeTransactions(flattenTransactions(localIncomeData))
    }
  }

  const refreshExpenseTransactions = () => {
    const localExpenseData = getTransactions({key: EXPENSES})
    if (!localExpenseData || Object.keys(localExpenseData).length === 0) {
      setIsMockData(prev => ({...prev, expenses: true}))
      setExpenseTransactions(mockExpenseData)
    } else {
      setIsMockData(prev => ({...prev, expenses: false}))
      setExpenseTransactions(localExpenseData)
      setFlatExpenseTransactions(flattenTransactions(localExpenseData))
    }
  }

  useEffect(() => {
    refreshIncomeTransactions()
    refreshExpenseTransactions()
  }, [])

////////////////////////////////////////////////////////////////////////////////
  const user = useUser()

  const [incomeTransactionsV2, setIncomeTransactionsV2] = 
    useState<TransactionTypeV2[]>([])
  const [expenseTransactionsV2, setExpenseTransactionsV2] = 
    useState<TransactionTypeV2[]>([])
  const [budgetTransactionsV2, setBudgetTransactionsV2] = 
    useState<BudgetTransactionTypeV2[]>([])
  const [loading, setLoading] = useState(false)

  const refreshIncomeTransactionsV2 = async () => {
    if (!user) {
      setIncomeTransactionsV2([])
      return
    }

    setLoading(true)
    const incomeResult = await getIncome({
      userId: user.id
    })
    setIncomeTransactionsV2(incomeResult ?? [])
    setLoading(false)
  }

  const refreshExpenseTransactionsV2 = async () => {
    if (!user) {
      setExpenseTransactionsV2([])
      return
    }

    setLoading(true)
    const expenseResult = await getExpenses({
      userId: user.id
    })
    setExpenseTransactionsV2(expenseResult ?? [])
    setLoading(false)
  }

  const refreshBudgetTransactionsV2 = async () => {
    if (!user) {
      setBudgetTransactionsV2([])
      return
    }

    setLoading(true)
    const budgetResult = await getBudget({
      userId: user.id
    })
    setBudgetTransactionsV2(budgetResult ?? [])
    setLoading(false)
  }

  useEffect(() => {
    refreshIncomeTransactionsV2()
    refreshExpenseTransactionsV2()
    refreshBudgetTransactionsV2()
  }, [user?.id])
////////////////////////////////////////////////////////////////////////////////

  return (
    <TransactionContext.Provider value={{
      incomeTransactions,
      flatIncomeTransactions,
      expenseTransactions,
      flatExpenseTransactions,
      refreshIncomeTransactions,
      refreshExpenseTransactions,
      isMockData,

      incomeTransactionsV2,
      refreshIncomeTransactionsV2,
      expenseTransactionsV2,
      refreshExpenseTransactionsV2,
      budgetTransactionsV2,
      refreshBudgetTransactionsV2
    }}>
      {props.children}
    </TransactionContext.Provider>
  )
}