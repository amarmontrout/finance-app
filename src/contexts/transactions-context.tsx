import { EXPENSES, INCOME, MONTHS } from "@/globals/globals"
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

  const refreshIncomeTransactions = () => {
    const localIncomeData = getTransactions({key: INCOME})
    if (!localIncomeData) {
      return
    }
    setIncomeTransactions(localIncomeData)
  }


  const refreshExpenseTransactions = () => {
    const localExpenseData = getTransactions({key: EXPENSES})
    if (!localExpenseData) {
      return
    }
    setExpenseTransactions(localExpenseData)
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
      currentMonth
    }}>
      {props.children}
    </TransactionContext.Provider>
  )
}