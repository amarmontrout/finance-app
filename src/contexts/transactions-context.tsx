import { EXPENSE_CATEGORIES_KEY, EXPENSES, INCOME, INCOME_CATEGORIES_KEY, YEARS_KEY } from "@/globals/globals"
import { mockExpenseCategories, mockExpenseData, mockIncomeCategories, mockIncomeData, mockYears } from "@/globals/mockData"
import { getChoices } from "@/utils/choiceStorage"
import { getTransactions, TransactionData } from "@/utils/transactionStorage"
import { createContext, useContext, useEffect, useState } from "react"

type TransactionsContextType = {
  incomeTransactions: TransactionData
  expenseTransactions: TransactionData
  refreshIncomeTransactions: () => void
  refreshExpenseTransactions: () => void
  refreshYearChoices: () => void
  years: string[]
  refreshIncomeCategoryChoices: () => void
  incomeCategories: string[]
  refreshExpenseCategoryChoices: () => void
  expenseCategories: string[]
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
  const [incomeTransactions, setIncomeTransactions] = useState<TransactionData>({})
  const [expenseTransactions, setExpenseTransactions] = useState<TransactionData>({})
  const [years, setYears] = useState<string[]>([])
  const [incomeCategories, setIncomeCategories] = useState<string[]>([])
  const [expenseCategories, setExpenseCategories] = useState<string[]>([])

  const [isMockData, setIsMockData] = useState<MockDataType>(mockDataInit)

  const refreshYearChoices = () => {
    const yearChoices = getChoices({key: YEARS_KEY})
    if (!yearChoices || yearChoices.length === 0) {
      setIsMockData(prev => ({...prev, years: true}))
      setYears(mockYears)
    } else {
      setIsMockData(prev => ({...prev, years: false}))
      setYears(yearChoices)
    }
  }

  const refreshIncomeCategoryChoices = () => {
    const incomeChoices = getChoices({key: INCOME_CATEGORIES_KEY})
    if (!incomeChoices || incomeChoices.length === 0) {
      setIsMockData(prev => ({...prev, incomeCategories: true}))
      setIncomeCategories(mockIncomeCategories)
    } else {
      setIsMockData(prev => ({...prev, incomeCategories: false}))
      setIncomeCategories(incomeChoices)
    }
  }

  const refreshExpenseCategoryChoices = () => {
    const expenseChoices = getChoices({key: EXPENSE_CATEGORIES_KEY})
    if (!expenseChoices || expenseChoices.length === 0) {
      setIsMockData(prev => ({...prev, expensesCategories: true}))
      setExpenseCategories(mockExpenseCategories)
    } else {
      setIsMockData(prev => ({...prev, expensesCategories: false}))
      setExpenseCategories(expenseChoices)
    }
  }

  useEffect(() => {
    refreshYearChoices()
    refreshIncomeCategoryChoices()
    refreshExpenseCategoryChoices()
  }, [])

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
      years,
      incomeCategories,
      expenseCategories,
      refreshYearChoices,
      refreshIncomeCategoryChoices,
      refreshExpenseCategoryChoices,
      isMockData
    }}>
      {props.children}
    </TransactionContext.Provider>
  )
}