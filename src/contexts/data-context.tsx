import {
  V2AccountType,
  V2CategoryType,
  V2HydratedTransactionType,
  V2MerchantType,
} from "@/api/v2/models"
import {
  getAccountsV2,
  getCategoriesV2,
  getMerchantsV2,
  getTransactionsV2,
} from "@/api/v2/requests"
import { hydrateTransactions } from "@/app/(admin)/v2/utils"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

type DataContextType = {
  // isLoading: boolean
  transactions: V2HydratedTransactionType[]
  refreshTransactions: () => Promise<void>
  accounts: V2AccountType[]
  refreshAccounts: () => Promise<void>
  categories: V2CategoryType[]
  refreshCategories: () => Promise<void>
  merchants: V2MerchantType[]
  refreshMerchants: () => Promise<void>
}

const DataContext = createContext<DataContextType | null>(null)

export const useDataContext = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider")
  }
  return context
}

export const DataProvider = (props: { children: React.ReactNode }) => {
  // const [isLoading, setIsLoading] = useState(true)
  const [accounts, setAccounts] = useState<V2AccountType[]>([])
  const [categories, setCategories] = useState<V2CategoryType[]>([])
  const [merchants, setMerchants] = useState<V2MerchantType[]>([])
  const [transactions, setTransactions] = useState<V2HydratedTransactionType[]>(
    [],
  )

  const refreshAccounts = useCallback(async () => {
    const a = await getAccountsV2({
      filters: [
        {
          column: "deleted_at",
          operator: "eq",
          value: null,
        },
      ],
    })
    setAccounts(
      (a ?? []).sort((x, y) =>
        x.name.localeCompare(y.name, undefined, { sensitivity: "base" }),
      ),
    )
  }, [])

  const refreshCategories = useCallback(async () => {
    const c = await getCategoriesV2({
      filters: [
        {
          column: "deleted_at",
          operator: "eq",
          value: null,
        },
      ],
    })
    setCategories(
      (c ?? []).sort((x, y) =>
        x.name.localeCompare(y.name, undefined, { sensitivity: "base" }),
      ),
    )
  }, [])

  const refreshMerchants = useCallback(async () => {
    const m = await getMerchantsV2({
      filters: [
        {
          column: "deleted_at",
          operator: "eq",
          value: null,
        },
      ],
    })
    setMerchants(
      (m ?? []).sort((x, y) =>
        x.name.localeCompare(y.name, undefined, { sensitivity: "base" }),
      ),
    )
  }, [])

  const refreshTransactions = useCallback(async () => {
    if (accounts.length == 0 || categories.length == 0 || merchants.length == 0)
      return
    const t = await getTransactionsV2({
      filters: [
        {
          column: "deleted_at",
          operator: "eq",
          value: null,
        },
      ],
    })
    const sortedTransactions = [...t!].sort((a, b) =>
      b.transaction_date.localeCompare(a.transaction_date),
    )
    const ht = hydrateTransactions({
      accounts: accounts,
      categories: categories,
      merchants: merchants,
      transactions: sortedTransactions ?? [],
    })
    setTransactions(ht)
  }, [])

  // Initial data fetch
  useEffect(() => {
    refreshAccounts()
    refreshCategories()
    refreshMerchants()
  }, [])

  // Fetch hydrated data (transactions)
  useEffect(() => {
    refreshTransactions()
  }, [accounts, categories, merchants])

  return (
    <DataContext.Provider
      value={{
        // isLoading,
        transactions,
        refreshTransactions,
        accounts,
        refreshAccounts,
        categories,
        refreshCategories,
        merchants,
        refreshMerchants,
      }}
    >
      {props.children}
    </DataContext.Provider>
  )
}
