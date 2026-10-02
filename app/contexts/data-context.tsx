import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { AccountType } from "../(api)/accounts/models"
import { getAllAccounts } from "../(api)/accounts/requests"
import { BudgetType } from "../(api)/budgets/models"
import { getAllBudgets } from "../(api)/budgets/requests"
import { CategoryType } from "../(api)/categories/models"
import { getAllCategories } from "../(api)/categories/requests"
import { MerchantType } from "../(api)/merchants/models"
import { getAllMerchants } from "../(api)/merchants/requests"
import { getTransactions } from "../(api)/transactions/requests"
import { AlertToastType } from "../components/ui/AlertToast"
import { currencyFormatter } from "../lib/functions/formatters"
import { getISODate, getISOMonth } from "../lib/functions/getters"
import { HookSetter } from "../lib/types"

type DataContextType = {
  isDataContextLoading: boolean
  accounts: AccountType[]
  refreshAccounts: () => Promise<void>
  categories: CategoryType[]
  refreshCategories: () => Promise<void>
  merchants: MerchantType[]
  refreshMerchants: () => Promise<void>
  budgets: BudgetType[]
  activeBudgets: BudgetType[]
  refreshBudgets: () => Promise<void>
  accountMap: Map<string, AccountType>
  categoryMap: Map<string, CategoryType>
  merchantMap: Map<string, MerchantType>
  alertToast: AlertToastType | undefined
  setAlertToast: HookSetter<AlertToastType | undefined>
  openAddMerchant: boolean
  setOpenAddMerchant: HookSetter<boolean>
  openAddAccount: boolean
  setOpenAddAccount: HookSetter<boolean>
  openAddCategory: boolean
  setOpenAddCategory: HookSetter<boolean>
  openAddBudget: boolean
  setOpenAddBudget: HookSetter<boolean>
  budgetToEdit: BudgetType | undefined
  setBudgetToEdit: HookSetter<BudgetType | undefined>
  recommendedBudget: string | undefined
}

const DataContext = createContext<DataContextType | null>(null)

export const useDataContext = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider")
  }
  return context
}

const sortByName = <T extends { name: string }>(items: T[]) => {
  return [...items].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, {
      sensitivity: "base",
    }),
  )
}

export const DataProvider = (props: { children: React.ReactNode }) => {
  const [isDataContextLoading, setIsDataContextLoading] = useState(true)
  const [accounts, setAccounts] = useState<AccountType[]>([])
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [merchants, setMerchants] = useState<MerchantType[]>([])
  const [budgets, setBudgets] = useState<BudgetType[]>([])
  const [alertToast, setAlertToast] = useState<AlertToastType>()
  const [openAddMerchant, setOpenAddMerchant] = useState<boolean>(false)
  const [openAddAccount, setOpenAddAccount] = useState<boolean>(false)
  const [openAddCategory, setOpenAddCategory] = useState<boolean>(false)
  const [openAddBudget, setOpenAddBudget] = useState<boolean>(false)
  const [budgetToEdit, setBudgetToEdit] = useState<BudgetType>()
  const [recommendedBudget, setRecommendedBudget] = useState<string>()

  const activeBudgets = useMemo(
    () => budgets.filter((b) => b.end_month === null),
    [budgets],
  )

  const refreshAccounts = useCallback(async () => {
    const accounts = await getAllAccounts()
    setAccounts(sortByName(accounts ?? []))
  }, [])

  const refreshCategories = useCallback(async () => {
    const categories = await getAllCategories()
    setCategories(sortByName(categories ?? []))
  }, [])

  const refreshMerchants = useCallback(async () => {
    const merchants = await getAllMerchants()
    setMerchants(sortByName(merchants ?? []))
  }, [])

  const refreshBudgets = useCallback(async () => {
    const budgets = await getAllBudgets()
    setBudgets(budgets ?? [])
  }, [])

  const refreshData = useCallback(async () => {
    setIsDataContextLoading(true)
    try {
      await Promise.all([
        refreshAccounts(),
        refreshCategories(),
        refreshMerchants(),
        refreshBudgets(),
      ])
    } finally {
      setIsDataContextLoading(false)
    }
  }, [refreshAccounts, refreshCategories, refreshMerchants, refreshBudgets])

  const accountMap = useMemo(
    () => new Map(accounts.map((a) => [a.account_id, a])),
    [accounts],
  )

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.category_id, c])),
    [categories],
  )

  const merchantMap = useMemo(
    () => new Map(merchants.map((m) => [m.merchant_id, m])),
    [merchants],
  )

  useEffect(() => {
    refreshData()
  }, [refreshData])

  useEffect(() => {
    // TODO: Does not consider returns made in a different month from the initial transaction.
    const getRecommendedBudget = async () => {
      if (!budgetToEdit) {
        setRecommendedBudget(undefined)
        return
      }
      const today = new Date()
      const currentYear = today.getFullYear()
      const currentMonthIndex = today.getMonth()
      const isJanuary = currentMonthIndex === 0
      const startDate = isJanuary
        ? getISOMonth(new Date(currentYear - 1, 0))
        : getISOMonth(new Date(currentYear, 0))
      const endDate = isJanuary
        ? getISODate(new Date(currentYear - 1, 11, 31))
        : getISODate(new Date(currentYear, currentMonthIndex, 0))
      const periodTransactions = await getTransactions({
        startOfMonth: startDate,
        endOfMonth: endDate,
      })
      const categoryTransactions = periodTransactions.filter(
        (transaction) =>
          transaction.category_id === budgetToEdit.category_id &&
          transaction.transaction_type === "Expense",
      )
      const returnAmounts = new Map<string, number>()
      periodTransactions.forEach((transaction) => {
        if (
          transaction.transaction_type === "Return" &&
          transaction.parent_transaction_id
        ) {
          const current =
            returnAmounts.get(transaction.parent_transaction_id) ?? 0
          returnAmounts.set(
            transaction.parent_transaction_id,
            current + transaction.amount,
          )
        }
      })
      const monthlySpending = new Map<string, number>()
      categoryTransactions.forEach((transaction) => {
        const month = transaction.transaction_date.slice(0, 7)
        const returnedAmount =
          returnAmounts.get(transaction.transaction_id) ?? 0
        const netAmount = transaction.amount - returnedAmount
        monthlySpending.set(
          month,
          (monthlySpending.get(month) ?? 0) + netAmount,
        )
      })
      const spendingAmounts = [...monthlySpending.values()].filter(
        (amount) => amount > 0,
      )
      const totalCategorySpent = spendingAmounts.reduce(
        (total, amount) => total + amount,
        0,
      )
      const spendingMonths = spendingAmounts.length
      const averageSpent =
        spendingMonths > 0 ? totalCategorySpent / spendingMonths : 0
      const roundedBudget = Math.round(averageSpent / 5) * 5
      setRecommendedBudget(currencyFormatter.format(roundedBudget))
    }
    getRecommendedBudget()
  }, [budgetToEdit])

  return (
    <DataContext.Provider
      value={{
        isDataContextLoading,
        accounts,
        refreshAccounts,
        categories,
        refreshCategories,
        merchants,
        refreshMerchants,
        budgets,
        activeBudgets,
        refreshBudgets,
        accountMap,
        categoryMap,
        merchantMap,
        alertToast,
        setAlertToast,
        openAddMerchant,
        setOpenAddMerchant,
        openAddAccount,
        setOpenAddAccount,
        openAddCategory,
        setOpenAddCategory,
        openAddBudget,
        setOpenAddBudget,
        budgetToEdit,
        setBudgetToEdit,
        recommendedBudget,
      }}
    >
      {props.children}
    </DataContext.Provider>
  )
}
