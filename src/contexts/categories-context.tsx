import { 
  EXPENSE_CATEGORIES_KEY, 
  INCOME_CATEGORIES_KEY, 
  YEARS_KEY 
} from "@/globals/globals"
import { 
  mockExpenseCategories,
  mockIncomeCategories,
  mockYears 
} from "@/globals/mockData"
import { getChoices } from "@/utils/choiceStorage"
import { createContext, useContext, useEffect, useState } from "react"

type CategoryContextType = {
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

const CategoryContext = createContext<CategoryContextType | null>(null)

export const useCategoryContext = () => {
  const context = useContext(CategoryContext)

  if (!context) {
    throw new Error("useCategoryContext must be used within a CategoryProvider")
  }

  return context
}

export const CategoryProvider = (props: {
  children: React.ReactNode
}) => {
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

  return (
    <CategoryContext.Provider value={{
      years,
      incomeCategories,
      expenseCategories,
      refreshYearChoices,
      refreshIncomeCategoryChoices,
      refreshExpenseCategoryChoices,
      isMockData
    }}>
      {props.children}
    </CategoryContext.Provider>
  )
}