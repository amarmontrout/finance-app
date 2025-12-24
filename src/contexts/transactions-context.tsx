import { EXPENSE_CATEGORIES_KEY, EXPENSES, INCOME, INCOME_CATEGORIES_KEY, YEARS_KEY } from "@/globals/globals"
import { mockExpenseData, mockIncomeData } from "@/globals/mockData"
import { getChoices } from "@/utils/choiceStorage"
import { getTransactions, TransactionData } from "@/utils/transactionStorage"
import { createContext, useContext, useEffect, useState } from "react"

type TransactionsContextType = {
  incomeTransactions: TransactionData
  expenseTransactions: TransactionData
  refreshIncomeTransactions: () => void
  refreshExpenseTransactions: () => void
  isMockData: boolean
  refreshYearChoices: () => void
  years: string[]
  refreshIncomeCategoryChoices: () => void
  incomeCategories: string[]
  refreshExpenseCategoryChoices: () => void
  expenseCategories: string[]
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
  const [isMockData, setIsMockData] = useState<boolean>(false)
  const [years, setYears] = useState<string[]>([])
  const [incomeCategories, setIncomeCategories] = useState<string[]>([])
  const [expenseCategories, setExpenseCategories] = useState<string[]>([])

  const refreshYearChoices = () => {
    const yearChoices = getChoices({key: YEARS_KEY})
    if (yearChoices) setYears(yearChoices)
  }

  const refreshIncomeCategoryChoices = () => {
    const incomeChoices = getChoices({key: INCOME_CATEGORIES_KEY})
    if (incomeChoices) setIncomeCategories(incomeChoices)
  }

  const refreshExpenseCategoryChoices = () => {
    const expenseChoices = getChoices({key: EXPENSE_CATEGORIES_KEY})
    if (expenseChoices) setExpenseCategories(expenseChoices)
  }

  useEffect(() => {
    refreshYearChoices()
    refreshIncomeCategoryChoices()
    refreshExpenseCategoryChoices()
  }, [])

  const refreshIncomeTransactions = () => {
    const localIncomeData = getTransactions({key: INCOME})
    if (!localIncomeData || Object.keys(localIncomeData).length === 0) {
      setIsMockData(true)
      setIncomeTransactions(mockIncomeData)
    } else {
      setIsMockData(false)
      setIncomeTransactions(localIncomeData)
    }
  }

  const refreshExpenseTransactions = () => {
    const localExpenseData = getTransactions({key: EXPENSES})
    if (!localExpenseData || Object.keys(localExpenseData).length === 0) {
      setIsMockData(true)
      setExpenseTransactions(mockExpenseData)
    } else {
      setIsMockData(false)
      setExpenseTransactions(localExpenseData)
    }
  }

  return (
    <TransactionContext.Provider value={{
      incomeTransactions,
      expenseTransactions,
      refreshIncomeTransactions,
      refreshExpenseTransactions,
      isMockData,
      years,
      incomeCategories,
      expenseCategories,
      refreshYearChoices,
      refreshIncomeCategoryChoices,
      refreshExpenseCategoryChoices
    }}>
      {props.children}
    </TransactionContext.Provider>
  )
}