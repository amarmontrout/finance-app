import { EXPENSES, INCOME, MONTHS } from "@/globals/globals"
import { mockExpenseData, mockIncomeData } from "@/globals/mockData"
import { getMonthTotal } from "@/utils/getTotals"
import getTransactions from "@/utils/getTransactions"
import { TransactionData } from "@/utils/saveTransaction"
import { createContext, useContext, useState } from "react"

type TransactionsContextType = {
  incomeTransactions: TransactionData
  expenseTransactions: TransactionData
  refreshIncomeTransactions: () => void
  refreshExpenseTransactions: () => void
  selectedYear: string
  setSelectedYear: React.Dispatch<React.SetStateAction<string>>
  selectedMonth: string
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>
  currentYear: string
  currentMonth: string
  getMonthExpenseTotal: () => string
  getMonthIncomeTotal: () => string
  isMockData: boolean
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
  const today = new Date()
  const currentYear = String(today.getFullYear())
  const currentMonth = MONTHS[today.getMonth()]

  const [incomeTransactions, setIncomeTransactions] = useState<TransactionData>({})
  const [expenseTransactions, setExpenseTransactions] = useState<TransactionData>({})
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [isMockData, setIsMockData] = useState<boolean>(false)

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

  const getMonthExpenseTotal = () => {
    if (selectedMonth !== "" && expenseTransactions) {
      const total = getMonthTotal(selectedYear, selectedMonth, expenseTransactions)
      if (!total || selectedMonth === "") return "$ 0"
      return total
    }

    return "$ 0"
  }

  const getMonthIncomeTotal = () => {
    if (selectedMonth !== "" && incomeTransactions) {
      const total = getMonthTotal( selectedYear, selectedMonth, incomeTransactions)
      
      if (!total || selectedMonth === "") return "$ 0"
      return total
    }

    return "$ 0"
  }

  return (
    <TransactionContext.Provider value={{
      incomeTransactions,
      expenseTransactions,
      refreshIncomeTransactions,
      refreshExpenseTransactions,
      selectedYear,
      setSelectedYear,
      selectedMonth,
      setSelectedMonth,
      currentYear,
      currentMonth,
      getMonthExpenseTotal,
      getMonthIncomeTotal,
      isMockData
    }}>
      {props.children}
    </TransactionContext.Provider>
  )
}