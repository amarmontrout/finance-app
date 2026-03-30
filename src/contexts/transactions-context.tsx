import { getTransactions } from "@/app/api/Transactions/requests"
import { useUser } from "@/hooks/useUser"
import { NewTransactionType } from "@/utils/type"
import { createContext, useContext, useEffect, useState } from "react"

type TransactionsContextType = {
  isLoading: boolean
  transactions: NewTransactionType[]
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
  const [transactions, setTransactions] = useState<NewTransactionType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const refreshTransactions = async () => {
    if (!user) {
      return
    }
    console.log("Pulling Transactions...")
    const result = await getTransactions({
      userId: user.id,
    })
    setTransactions(result ?? [])
  }
  const loadTransactions = async () => {
    if (!user) return
    setIsLoading(true)
    await Promise.all([refreshTransactions()])
    setIsLoading(false)
  }

  useEffect(() => {
    if (user) {
      loadTransactions()
    }
  }, [user])

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
