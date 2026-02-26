import {
  getBudgetCategories,
  getExpenseCategories,
  getIncomeCategories,
  getYearChoices,
} from "@/app/api/Choices/requests"
import { useUser } from "@/hooks/useUser"
import { getExcludedCategorySet } from "@/utils/helperFunctions"
import { BudgetTypeV2, ChoiceTypeV2 } from "@/utils/type"
import { createContext, useContext, useEffect, useState } from "react"

type CategoryContextType = {
  excludedSet: Set<string>
  yearsV2: ChoiceTypeV2[]
  refreshYearChoicesV2: () => void
  incomeCategoriesV2: ChoiceTypeV2[]
  refreshIncomeCategoryChoicesV2: () => void
  expenseCategoriesV2: ChoiceTypeV2[]
  refreshExpenseCategoryChoicesV2: () => void
  budgetCategoriesV2: BudgetTypeV2[]
  refreshBudgetCategoryChoicesV2: () => void
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

  const excludedSet = getExcludedCategorySet(expenseCategoriesV2)

  const refreshYearChoicesV2 = async () => {
    if (!user) {
      return
    }
    console.log("Pulling Year Choices...")
    const yearsResult = await getYearChoices({
      userId: user.id,
    })
    if (yearsResult === null) {
      setYearsV2([])
      return
    }
    const sortedYears = [...yearsResult].sort(
      (a, b) => Number(b.name) - Number(a.name),
    )
    setYearsV2(sortedYears)
  }

  const refreshIncomeCategoryChoicesV2 = async () => {
    if (!user) {
      return
    }
    console.log("Pulling Income Category Choices...")
    const incomeCategoryResult = await getIncomeCategories({
      userId: user.id,
    })
    if (incomeCategoryResult == null) {
      setIncomeCategoriesV2([])
      return
    }
    const sortedIncomeCategories = [...incomeCategoryResult].sort((a, b) =>
      a.name.localeCompare(b.name),
    )
    setIncomeCategoriesV2(sortedIncomeCategories)
  }

  const refreshExpenseCategoryChoicesV2 = async () => {
    if (!user) {
      return
    }
    console.log("Pulling Expense Category Choices...")
    const expenseCategoryResult = await getExpenseCategories({
      userId: user.id,
    })
    if (expenseCategoryResult == null) {
      setExpenseCategoriesV2([])
      return
    }
    const sortedExpenseCategories = [...expenseCategoryResult].sort((a, b) =>
      a.name.localeCompare(b.name),
    )
    setExpenseCategoriesV2(sortedExpenseCategories)
  }

  const refreshBudgetCategoryChoicesV2 = async () => {
    if (!user) {
      return
    }
    console.log("Pulling Budget Category Choices...")
    const budgetCategoryResult = await getBudgetCategories({
      userId: user.id,
    })
    if (budgetCategoryResult == null) {
      setBudgetCategoriesV2([])
      return
    }
    const sortedBudgetCategories = [...budgetCategoryResult].sort((a, b) =>
      a.category.localeCompare(b.category),
    )
    setBudgetCategoriesV2(sortedBudgetCategories)
  }

  useEffect(() => {
    if (!user) {
      return
    }

    const load = async () => {
      setIsLoading(true)

      await Promise.all([
        refreshYearChoicesV2(),
        refreshIncomeCategoryChoicesV2(),
        refreshExpenseCategoryChoicesV2(),
        refreshBudgetCategoryChoicesV2(),
      ])

      setIsLoading(false)
    }

    load()
  }, [user])

  return (
    <CategoryContext.Provider
      value={{
        excludedSet,
        yearsV2,
        refreshYearChoicesV2,
        incomeCategoriesV2,
        refreshIncomeCategoryChoicesV2,
        expenseCategoriesV2,
        refreshExpenseCategoryChoicesV2,
        budgetCategoriesV2,
        refreshBudgetCategoryChoicesV2,
        isLoading,
      }}
    >
      {props.children}
    </CategoryContext.Provider>
  )
}
