import {
  AccountTypeValue,
  TransactionTypeValue,
  V2TransactionType,
} from "@/api/v2/models"
import { getTransactionsV2, updateTransactionV2 } from "@/api/v2/requests"
import { useDataContext } from "@/contexts/data-context"
import { getTransactionsTotal } from "@/global/dataFunctions"
import { getMonthRange } from "@/global/formattingFunctions"
import { AlertToastType, HookSetter } from "@/types/types"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import {
  END_DATE_FILTER,
  NOT_DELETED_FILTER,
  START_DATE_FILTER,
} from "./constants"

type TransactionContextType = {
  selectedDate: Date
  setSelectedDate: HookSetter<Date>
  displayType: Partial<TransactionTypeValue>
  setDisplayType: HookSetter<Partial<TransactionTypeValue>>
  expenseView: Partial<AccountTypeValue> | "Both"
  setExpenseView: HookSetter<Partial<AccountTypeValue> | "Both">
  selectedTransaction: V2TransactionType | null
  setSelectedTransaction: HookSetter<V2TransactionType | null>
  alertToast: AlertToastType | undefined
  setAlertToast: HookSetter<AlertToastType | undefined>
  isLoading: boolean
  totalAmount: number
  typeFilteredTransactions: V2TransactionType[]
  byDateTransactions: [string, V2TransactionType[]][]
  deleteTransaction: (transaction: V2TransactionType) => Promise<void>
  refreshTransactions: () => Promise<void>
  transactionsWithReturns: Map<string, string[]>
}

const TransactionContext = createContext<TransactionContextType | null>(null)

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
  // CONTEXTS ==================================================================
  const { accounts } = useDataContext()

  // STATES ====================================================================
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTransaction, setSelectedTransaction] =
    useState<V2TransactionType | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [alertToast, setAlertToast] = useState<AlertToastType>()

  const [currentMonthTransactions, setCurrentMonthTransactions] = useState<
    V2TransactionType[]
  >([])

  const [displayType, setDisplayType] =
    useState<Partial<TransactionTypeValue>>("Income")
  const [expenseView, setExpenseView] = useState<
    Partial<AccountTypeValue> | "Both"
  >("Both")

  // VARIABLES =================================================================

  const typeFilteredTransactions = useMemo(() => {
    if (displayType === "Income") {
      return currentMonthTransactions.filter(
        (transaction) => transaction.transaction_type === "Income",
      )
    }

    return currentMonthTransactions.filter((transaction) => {
      if (transaction.transaction_type !== "Expense") {
        return false
      }

      const accountIdToTypeMap = new Map(
        accounts.map((account) => [account.account_id, account.type]),
      )

      if (expenseView === "Both") {
        return true
      }

      return accountIdToTypeMap.get(transaction.account_id!) === expenseView
    })
  }, [currentMonthTransactions, displayType, expenseView])

  const totalAmount = useMemo(
    () =>
      getTransactionsTotal({
        transactions: typeFilteredTransactions,
      }),
    [typeFilteredTransactions],
  )

  const transactionsWithReturns = useMemo(() => {
    return currentMonthTransactions.reduce<Map<string, string[]>>(
      (map, transaction) => {
        const parentId = transaction.parent_transaction_id

        if (!parentId) return map

        const existing = map.get(parentId) ?? []

        existing.push(transaction.transaction_id)
        map.set(parentId, existing)

        return map
      },
      new Map(),
    )
  }, [currentMonthTransactions])

  const byDateTransactions = useMemo(() => {
    const grouped = typeFilteredTransactions.reduce<
      Record<string, V2TransactionType[]>
    >((acc, transaction) => {
      const date = transaction.transaction_date

      if (!acc[date]) acc[date] = []
      acc[date].push(transaction)

      return acc
    }, {})

    return Object.entries(grouped).sort(([dateA], [dateB]) =>
      dateB.localeCompare(dateA),
    )
  }, [typeFilteredTransactions])

  // FUNCTIONS =================================================================
  const refreshTransactions = async () => {
    setIsLoading(true)
    try {
      const { startDate, endDate } = getMonthRange({
        currentDate: selectedDate,
      })
      const transactions = await getTransactionsV2({
        filters: [
          START_DATE_FILTER(startDate),
          END_DATE_FILTER(endDate),
          NOT_DELETED_FILTER,
        ],
      })
      setCurrentMonthTransactions(transactions ?? [])
    } catch (error) {
      console.error(error)
      setCurrentMonthTransactions([])
    } finally {
      setIsLoading(false)
    }
  }

  const showToast = (severity: "success" | "error", message: string) =>
    setAlertToast({
      open: true,
      severity,
      message,
      onClose: () => setAlertToast(undefined),
    })

  const deleteTransaction = async (transaction: V2TransactionType) => {
    if (!transaction) return
    try {
      await updateTransactionV2({
        rowId: transaction.transaction_id,
        body: { deleted_at: new Date().toISOString() },
      })
      showToast("success", "Transaction deleted successfully!")
    } catch {
      showToast("error", "Transaction could not be deleted.")
    } finally {
      refreshTransactions()
      setSelectedTransaction(null)
    }
  }

  // USEEFFECTS ================================================================
  useEffect(() => {
    refreshTransactions()
  }, [selectedDate])

  const value = useMemo(
    () => ({
      selectedDate,
      setSelectedDate,
      displayType,
      setDisplayType,
      expenseView,
      setExpenseView,
      isLoading,
      totalAmount,
      typeFilteredTransactions,
      byDateTransactions,
      deleteTransaction,
      selectedTransaction,
      setSelectedTransaction,
      alertToast,
      setAlertToast,
      refreshTransactions,
      transactionsWithReturns,
    }),
    [
      selectedDate,
      setSelectedDate,
      displayType,
      setDisplayType,
      expenseView,
      setExpenseView,
      isLoading,
      totalAmount,
      typeFilteredTransactions,
      byDateTransactions,
      deleteTransaction,
      selectedTransaction,
      setSelectedTransaction,
      alertToast,
      setAlertToast,
      refreshTransactions,
      transactionsWithReturns,
    ],
  )
  return (
    <TransactionContext.Provider value={value}>
      {props.children}
    </TransactionContext.Provider>
  )
}
