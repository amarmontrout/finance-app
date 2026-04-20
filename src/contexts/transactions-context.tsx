import { getTransactions } from "@/app/api/Transactions/requests"
import { useUser } from "@/hooks/useUser"
import { TransactionType } from "@/utils/type"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

type TransactionsContextType = {
  isLoading: boolean
  transactions: TransactionType[]
  refreshTransactions: () => Promise<void>
}

const TransactionContext = createContext<TransactionsContextType | null>(null)

export const useTransactionContext = () => {
  const context = useContext(TransactionContext)

  if (!context) {
    throw new Error(
      "useTransactionContext must be used within a TransactionProvider",
    )
  }

  return context
}

export const TransactionProvider = (props: { children: React.ReactNode }) => {
  const user = useUser()
  const [transactions, setTransactions] = useState<TransactionType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshTransactions = useCallback(async () => {
    if (!user) return

    try {
      setIsLoading(true)
      console.log("Fetching Transactions...")
      const result = await getTransactions({
        userId: user.id,
      })
      setTransactions(result ?? [])
    } catch (error) {
      console.error("Failed to fetch transactions", error)
      setTransactions([])
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      setTransactions([])
      return
    }
    refreshTransactions()
  }, [user, refreshTransactions])

  return (
    <TransactionContext.Provider
      value={{
        isLoading,
        transactions,
        refreshTransactions,
      }}
    >
      {props.children}
    </TransactionContext.Provider>
  )
}
