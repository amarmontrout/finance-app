import {
  getBudgetCategories,
  getExpenseCategories,
  getIncomeCategories,
  getYearChoices,
  saveBudgetCategory,
  saveExpenseCategory,
} from "@/app/api/Choices/requests"
import { useUser } from "@/hooks/useUser"
import { getExcludedCategorySet, makeId } from "@/utils/helperFunctions"
import { BudgetTypeV2, ChoiceTypeV2 } from "@/utils/type"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

type CategoryContextType = {
  excludedSet: Set<string>
  yearsV2: ChoiceTypeV2[]
  incomeCategoriesV2: ChoiceTypeV2[]
  expenseCategoriesV2: ChoiceTypeV2[]
  budgetCategoriesV2: BudgetTypeV2[]
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

  const [yearsV2, setYearsV2] = useState<ChoiceTypeV2[]>([])
  const [incomeCategoriesV2, setIncomeCategoriesV2] = useState<ChoiceTypeV2[]>(
    [],
  )
  const [expenseCategoriesV2, setExpenseCategoriesV2] = useState<
    ChoiceTypeV2[]
  >([])
  const [budgetCategoriesV2, setBudgetCategoriesV2] = useState<BudgetTypeV2[]>(
    [],
  )
  const [isLoading, setIsLoading] = useState(true)

  const excludedSet = useMemo(
    () => getExcludedCategorySet(expenseCategoriesV2),
    [expenseCategoriesV2],
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
      setYearsV2,
      (a, b) => Number(b.name) - Number(a.name),
    )
    setSortedState(incomeResult, setIncomeCategoriesV2, (a, b) =>
      a.name.localeCompare(b.name),
    )
    setSortedState(expenseResult, setExpenseCategoriesV2, (a, b) =>
      a.name.localeCompare(b.name),
    )
    setSortedState(budgetResult, setBudgetCategoriesV2, (a, b) =>
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
        yearsV2,
        incomeCategoriesV2,
        expenseCategoriesV2,
        budgetCategoriesV2,
        loadCategories,
        isLoading,
      }}
    >
      {props.children}
    </CategoryContext.Provider>
  )
}
