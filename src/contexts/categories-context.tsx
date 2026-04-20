import {
  getBudgetCategories,
  getExpenseCategories,
  getIncomeCategories,
  getYearChoices,
} from "@/app/api/Choices/requests"
import { useUser } from "@/hooks/useUser"
import { BudgetType, ChoiceType } from "@/utils/type"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

type CategoryContextType = {
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

const sortOrEmpty = <T,>(
  data: T[] | null,
  sortFn: (a: T, b: T) => number,
): T[] => (data ? [...data].sort(sortFn) : [])

export const CategoryProvider = (props: { children: React.ReactNode }) => {
  const user = useUser()

  const [years, setYears] = useState<ChoiceType[]>([])
  const [incomeCategories, setIncomeCategories] = useState<ChoiceType[]>([])
  const [expenseCategories, setExpenseCategories] = useState<ChoiceType[]>([])
  const [budgetCategories, setBudgetCategories] = useState<BudgetType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadCategories = useCallback(async () => {
    if (!user) return

    try {
      setIsLoading(true)
      console.log("Fetching Categories...")
      const [yearsResult, incomeResult, expenseResult, budgetResult] =
        await Promise.all([
          getYearChoices({ userId: user.id }),
          getIncomeCategories({ userId: user.id }),
          getExpenseCategories({ userId: user.id }),
          getBudgetCategories({ userId: user.id }),
        ])
      setYears(
        sortOrEmpty(yearsResult, (a, b) => Number(b.name) - Number(a.name)),
      )
      setIncomeCategories(
        sortOrEmpty(incomeResult, (a, b) => a.name.localeCompare(b.name)),
      )
      setExpenseCategories(
        sortOrEmpty(expenseResult, (a, b) => a.name.localeCompare(b.name)),
      )
      setBudgetCategories(
        sortOrEmpty(budgetResult, (a, b) =>
          a.category.localeCompare(b.category),
        ),
      )
    } catch (err) {
      console.error("Failed to load categories", err)
      setYears([])
      setIncomeCategories([])
      setExpenseCategories([])
      setBudgetCategories([])
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      setYears([])
      setIncomeCategories([])
      setExpenseCategories([])
      setBudgetCategories([])
      return
    }

    loadCategories()
  }, [user, loadCategories])

  return (
    <CategoryContext.Provider
      value={{
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
