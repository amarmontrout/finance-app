import {
  getBudgetCategories,
  getExpenseCategories,
  getIncomeCategories,
  getYearChoices,
} from "@/app/api/Choices/requests"
import { useUser } from "@/hooks/useUser"
import { getExcludedCategorySet } from "@/utils/helperFunctions"
import { BudgetType, ChoiceType } from "@/utils/type"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

type CategoryContextType = {
  excludedSet: Set<string>
  years: ChoiceType[]
  incomeCategories: ChoiceType[]
  expenseCategories: ChoiceType[]
  budgetCategories: BudgetType[]
  loadCategories: () => Promise<void>
  isLoading: boolean
}

const CategoryContext = createContext<CategoryContextType | null>(null)

export const useCategoryContext = () => {
  const context = useContext(CategoryContext)
  if (!context) {
    throw new Error("useCategoryContext must be used within a CategoryProvider")
  }
  return context
}

export const CategoryProvider = (props: { children: React.ReactNode }) => {
  const user = useUser()

  const [years, setYears] = useState<ChoiceType[]>([])
  const [incomeCategories, setIncomeCategories] = useState<ChoiceType[]>([])
  const [expenseCategories, setExpenseCategories] = useState<ChoiceType[]>([])
  const [budgetCategories, setBudgetCategories] = useState<BudgetType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const excludedSet = useMemo(
    () => getExcludedCategorySet(expenseCategories),
    [expenseCategories],
  )

  const setSortedState = <T,>(
    result: T[] | null,
    setter: (value: T[]) => void,
    sortFn: (a: T, b: T) => number,
  ) => {
    setter(result ? [...result].sort(sortFn) : [])
  }

  const loadCategories = async () => {
    if (!user) return
    setIsLoading(true)
    const [yearsResult, incomeResult, expenseResult, budgetResult] =
      await Promise.all([
        getYearChoices({ userId: user.id }),
        getIncomeCategories({ userId: user.id }),
        getExpenseCategories({ userId: user.id }),
        getBudgetCategories({ userId: user.id }),
      ])
    setSortedState(
      yearsResult,
      setYears,
      (a, b) => Number(b.name) - Number(a.name),
    )
    setSortedState(incomeResult, setIncomeCategories, (a, b) =>
      a.name.localeCompare(b.name),
    )
    setSortedState(expenseResult, setExpenseCategories, (a, b) =>
      a.name.localeCompare(b.name),
    )
    setSortedState(budgetResult, setBudgetCategories, (a, b) =>
      a.category.localeCompare(b.category),
    )
    setIsLoading(false)
  }

  useEffect(() => {
    if (user) {
      loadCategories()
    }
  }, [user])

  return (
    <CategoryContext.Provider
      value={{
        excludedSet,
        years,
        incomeCategories,
        expenseCategories,
        budgetCategories,
        loadCategories,
        isLoading,
      }}
    >
      {props.children}
    </CategoryContext.Provider>
  )
}
