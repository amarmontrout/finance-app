import { V2AccountType, V2CategoryType, V2MerchantType } from "@/api/v2/models"
import {
  getAccountsV2,
  getCategoriesV2,
  getMerchantsV2,
} from "@/api/v2/requests"
import { NOT_DELETED_FILTER } from "@/app/(admin)/v2/constants"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

type DataContextType = {
  isLoading: boolean
  accounts: V2AccountType[]
  refreshAccounts: () => Promise<void>
  categories: V2CategoryType[]
  refreshCategories: () => Promise<void>
  merchants: V2MerchantType[]
  refreshMerchants: () => Promise<void>
  accountMap: Map<string, V2AccountType>
  categoryMap: Map<string, V2CategoryType>
  merchantMap: Map<string, V2MerchantType>
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
  const [isLoading, setIsLoading] = useState(true)
  const [accounts, setAccounts] = useState<V2AccountType[]>([])
  const [categories, setCategories] = useState<V2CategoryType[]>([])
  const [merchants, setMerchants] = useState<V2MerchantType[]>([])

  const refreshAccounts = useCallback(async () => {
    const accounts = await getAccountsV2({
      filters: [NOT_DELETED_FILTER],
    })

    setAccounts(sortByName(accounts ?? []))
  }, [])

  const refreshCategories = useCallback(async () => {
    const categories = await getCategoriesV2({
      filters: [NOT_DELETED_FILTER],
    })

    setCategories(sortByName(categories ?? []))
  }, [])

  const refreshMerchants = useCallback(async () => {
    const merchants = await getMerchantsV2({
      filters: [NOT_DELETED_FILTER],
    })

    setMerchants(sortByName(merchants ?? []))
  }, [])

  const refreshData = useCallback(async () => {
    setIsLoading(true)
    try {
      await Promise.all([
        refreshAccounts(),
        refreshCategories(),
        refreshMerchants(),
      ])
    } finally {
      setIsLoading(false)
    }
  }, [refreshAccounts, refreshCategories, refreshMerchants])

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
    void refreshData()
  }, [refreshData])

  const value = useMemo(
    () => ({
      isLoading,
      accounts,
      refreshAccounts,
      categories,
      refreshCategories,
      merchants,
      refreshMerchants,
      accountMap,
      categoryMap,
      merchantMap,
    }),
    [
      isLoading,
      accounts,
      refreshAccounts,
      categories,
      refreshCategories,
      merchants,
      refreshMerchants,
      accountMap,
      categoryMap,
      merchantMap,
    ],
  )

  return (
    <DataContext.Provider value={value}>{props.children}</DataContext.Provider>
  )
}
