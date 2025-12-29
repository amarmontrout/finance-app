import { 
  EXPENSES, 
  INCOME, 
} from "@/globals/globals"
import { 
  mockExpenseData, 
  mockIncomeData, 
} from "@/globals/mockData"
import { getTransactions, TransactionData } from "@/utils/transactionStorage"
import { createContext, useContext, useState } from "react"

type TransactionsContextType = {
  incomeTransactions: TransactionData
  expenseTransactions: TransactionData
  refreshIncomeTransactions: () => void
  refreshExpenseTransactions: () => void
  isMockData: MockDataType
}

type MockDataType = {
  years: boolean
  income: boolean
  incomeCategories: boolean
  expenses: boolean
  expensesCategories: boolean
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
  const [expenseTransactions, setExpenseTransactions] = 
    useState<TransactionData>({})
  const [isMockData, setIsMockData] = useState<MockDataType>(mockDataInit)

  const refreshIncomeTransactions = () => {
    const localIncomeData = getTransactions({key: INCOME})
    if (!localIncomeData || Object.keys(localIncomeData).length === 0) {
      setIsMockData(prev => ({...prev, income: true}))
      setIncomeTransactions(mockIncomeData)
    } else {
      setIsMockData(prev => ({...prev, income: false}))
      setIncomeTransactions(localIncomeData)
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
    }
  }

  return (
    <TransactionContext.Provider value={{
      incomeTransactions,
      expenseTransactions,
      refreshIncomeTransactions,
      refreshExpenseTransactions,
      isMockData
    }}>
      {props.children}
    </TransactionContext.Provider>
  )
}