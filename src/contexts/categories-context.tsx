import { getBudgetCategories, getExpenseCategories, getIncomeCategories, getYearChoices } from "@/app/api/Choices/requests"
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
import { useUser } from "@/hooks/useUser"
import { getChoices } from "@/utils/choiceStorage"
import { getExcludedCategorySet } from "@/utils/helperFunctions"
import { BudgetTypeV2, ChoiceTypeV2 } from "@/utils/type"
import { createContext, useContext, useEffect, useState } from "react"

type CategoryContextType = {
  refreshYearChoices: () => void
  years: Choice[]
  refreshIncomeCategoryChoices: () => void
  incomeCategories: Choice[]
  refreshExpenseCategoryChoices: () => void
  expenseCategories: Choice[]
  isMockData: MockDataType
  excludedSet: Set<string>
////////////////////////////////////////////////////////////////////////////////
  yearsV2: ChoiceTypeV2[]
  refreshYearChoicesV2: () => void
  incomeCategoriesV2: ChoiceTypeV2[]
  refreshIncomeCategoryChoicesV2: () => void
  expenseCategoriesV2: ChoiceTypeV2[]
  refreshExpenseCategoryChoicesV2: () => void
  budgetCategoriesV2: BudgetTypeV2[]
  refreshBudgetCategoryChoicesV2: () => void
}

type MockDataType = {
  years: boolean
  income: boolean
  incomeCategories: boolean
  expenses: boolean
  expensesCategories: boolean
}

export type Choice = {
  name: string
  isExcluded?: boolean
  isRecurring?: boolean
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
  const [years, setYears] = useState<Choice[]>([])
  const [incomeCategories, setIncomeCategories] = useState<Choice[]>([])
  const [expenseCategories, setExpenseCategories] = useState<Choice[]>([])
  const [isMockData, setIsMockData] = useState<MockDataType>(mockDataInit)
  const excludedSet = getExcludedCategorySet(expenseCategories)

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

////////////////////////////////////////////////////////////////////////////////
  const user = useUser()

  const [yearsV2, setYearsV2] = useState<ChoiceTypeV2[]>([])
  const [incomeCategoriesV2, setIncomeCategoriesV2] = useState<ChoiceTypeV2[]>([])
  const [expenseCategoriesV2, setExpenseCategoriesV2] = useState<ChoiceTypeV2[]>([])
  const [budgetCategoriesV2, setBudgetCategoriesV2] = useState<BudgetTypeV2[]>([])
  const [loading, setLoading] = useState(false)

  const refreshYearChoicesV2 = async () => {
    if (!user) {
      setYearsV2([])
      return
    }

    setLoading(true)
    const yearsResult = await getYearChoices({
      userId: user.id
    })
    if (yearsResult === null) {
      setYearsV2([])
      return
    }
    const sortedYears = [...yearsResult].sort((a, b) =>
      Number(b.name) - Number(a.name)
    )
    setYearsV2(sortedYears)
    setLoading(false)
  }

  const refreshIncomeCategoryChoicesV2 = async () => {
    if (!user) {
      setIncomeCategoriesV2([])
      return
    }

    setLoading(true)
    const incomeCategoryResult = await getIncomeCategories({
      userId: user.id
    })
    if (incomeCategoryResult == null) {
      setIncomeCategoriesV2([])
      return
    }
    const sortedIncomeCategories = [...incomeCategoryResult].sort((a, b) =>
      a.name.localeCompare(b.name)
    )
    setIncomeCategoriesV2(sortedIncomeCategories)
    setLoading(false)
  }

  const refreshExpenseCategoryChoicesV2 = async () => {
    if (!user) {
      setExpenseCategoriesV2([])
      return
    }

    setLoading(true)
    const expenseCategoryResult = await getExpenseCategories({
      userId: user.id
    })
    if (expenseCategoryResult == null) {
      setExpenseCategoriesV2([])
      return
    }
    const sortedExpenseCategories = [...expenseCategoryResult].sort((a, b) =>
      a.name.localeCompare(b.name)
    )
    setExpenseCategoriesV2(sortedExpenseCategories)
    setLoading(false)
  }

  const refreshBudgetCategoryChoicesV2 = async () => {
    if (!user) {
      setBudgetCategoriesV2([])
      return
    }

    setLoading(true)
    const budgetCategoryResult = await getBudgetCategories({
      userId: user.id
    })
    if (budgetCategoryResult == null) {
      setBudgetCategoriesV2([])
      return
    }
    const sortedBudgetCategories = [...budgetCategoryResult].sort((a, b) =>
      a.category.localeCompare(b.category)
    )
    setBudgetCategoriesV2(sortedBudgetCategories)
    setLoading(false)
  }

  useEffect(() => {
    refreshYearChoicesV2()
    refreshIncomeCategoryChoicesV2()
    refreshExpenseCategoryChoicesV2()
    refreshBudgetCategoryChoicesV2()
  }, [user])
////////////////////////////////////////////////////////////////////////////////

  return (
    <CategoryContext.Provider value={{
      years,
      incomeCategories,
      expenseCategories,
      refreshYearChoices,
      refreshIncomeCategoryChoices,
      refreshExpenseCategoryChoices,
      isMockData,
      excludedSet,
////////////////////////////////////////////////////////////////////////////////
      yearsV2,
      refreshYearChoicesV2,
      incomeCategoriesV2,
      refreshIncomeCategoryChoicesV2,
      expenseCategoriesV2,
      refreshExpenseCategoryChoicesV2,
      budgetCategoriesV2,
      refreshBudgetCategoryChoicesV2
    }}>
      {props.children}
    </CategoryContext.Provider>
  )
}