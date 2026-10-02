import {
  createContext,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  CreateTransactionType,
  TransactionType,
} from "../(api)/transactions/models"
import {
  createTransaction,
  getDeletedTransactions,
  getTransactions,
  softDeleteTransaction,
  updateTransaction,
} from "../(api)/transactions/requests"
import { AlertToastType } from "../components/ui/AlertToast"
import { getDateRange, getISODate } from "../lib/functions/getters"
import { HookSetter } from "../lib/types"

const createInitialTransaction = (): CreateTransactionType => ({
  transaction_type: "Income",
  amount: 0,
  transaction_date: getISODate(),
  category_id: "",
  merchant_id: "",
  account_id: "",
  description: "",
  is_paid: null,
})

type TransactionsContextType = {
  isTransactionsLoading: boolean
  transactions: TransactionType[]
  refreshTransactions: () => Promise<void>
  deletedTransactions: TransactionType[]
  refreshDeletedTransactions: () => Promise<void>
  updateExistingTransaction: () => Promise<void>
  deleteExistingTransaction: (transaction_id: string) => Promise<void>
  alertToast: AlertToastType | undefined
  setAlertToast: HookSetter<AlertToastType | undefined>
  selectedDate: Date
  setSelectedDate: HookSetter<Date>
  selectedTransaction: TransactionType | null
  setSelectedTransaction: HookSetter<TransactionType | null>
  openEditTransactionDialog: boolean
  setOpenEditTransactionDialog: HookSetter<boolean>
  openNewTransactionDialog: boolean
  setOpenNewTransactionDialog: HookSetter<boolean>
  newTransaction: CreateTransactionType
  setNewTransaction: HookSetter<CreateTransactionType>
  saveNewTransaction: () => Promise<void>
  createInitialTransaction: () => CreateTransactionType
  moneyInputRef: RefObject<HTMLInputElement | null>
  openAddReturn: boolean
  setOpenAddReturn: HookSetter<boolean>
  getReturnedAmount: (transactionId: string) => number
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
  const moneyInputRef = useRef<HTMLInputElement | null>(null)
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(true)
  const [alertToast, setAlertToast] = useState<AlertToastType>()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [transactions, setTransactions] = useState<TransactionType[]>([])
  const [deletedTransactions, setDeletedTransactions] = useState<
    TransactionType[]
  >([])

  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionType | null>(null)
  const [openEditTransactionDialog, setOpenEditTransactionDialog] =
    useState<boolean>(false)
  const [openNewTransactionDialog, setOpenNewTransactionDialog] =
    useState<boolean>(false)
  const [newTransaction, setNewTransaction] = useState<CreateTransactionType>(
    createInitialTransaction(),
  )

  const [openAddReturn, setOpenAddReturn] = useState<boolean>(false)

  const returnedAmountsMap = useMemo(() => {
    // TODO: Does not consider returns made in a different month from the initial transaction.
    const amounts = new Map<string, number>()
    transactions.forEach((transaction) => {
      if (
        transaction.transaction_type === "Return" &&
        transaction.parent_transaction_id
      ) {
        const current = amounts.get(transaction.parent_transaction_id) ?? 0
        amounts.set(
          transaction.parent_transaction_id,
          current + transaction.amount,
        )
      }
    })
    return amounts
  }, [transactions])

  const getReturnedAmount = useCallback(
    (transactionId: string) => returnedAmountsMap.get(transactionId) ?? 0,
    [returnedAmountsMap],
  )

  const refreshTransactions = useCallback(async () => {
    const { startOfMonth, endOfMonth } = getDateRange(selectedDate)
    try {
      const transactions = await getTransactions({
        startOfMonth: startOfMonth,
        endOfMonth: endOfMonth,
      })
      setTransactions(transactions ?? [])
    } catch (error) {
      console.error("Failed to fetch transactions", error)
      setTransactions([])
    }
  }, [selectedDate])

  const refreshDeletedTransactions = useCallback(async () => {
    try {
      const transactions = await getDeletedTransactions()
      setDeletedTransactions(transactions ?? [])
    } catch (error) {
      console.error("Failed to fetch deleted transactions", error)
      setDeletedTransactions([])
    }
  }, [])

  const refreshData = useCallback(async () => {
    setIsTransactionsLoading(true)
    try {
      await Promise.all([refreshTransactions(), refreshDeletedTransactions()])
    } finally {
      setIsTransactionsLoading(false)
    }
  }, [refreshTransactions, refreshDeletedTransactions])

  const saveNewTransaction = async () => {
    try {
      createTransaction({ body: newTransaction })
      await refreshTransactions()
      setOpenNewTransactionDialog(false)
      setNewTransaction(createInitialTransaction())
      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "success",
        message: "Transaction saved successfully",
      })
    } catch (error) {
      console.error(error)
      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "error",
        message: "Transaction could not be saved",
      })
    }
  }

  const updateExistingTransaction = async () => {
    if (!selectedTransaction) return
    const {
      transaction_id,
      account,
      category,
      merchant,
      created_at,
      deleted_at,
      ...body
    } = selectedTransaction
    try {
      await updateTransaction({ transactionId: transaction_id, body })
      await refreshTransactions()
      setOpenEditTransactionDialog(false)
      setSelectedTransaction(null)
      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "success",
        message: "Transaction updated successfully",
      })
    } catch (error) {
      console.error(error)
      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "error",
        message: "Transaction could not be updated",
      })
    }
  }

  const deleteExistingTransaction = async (transaction_id: string) => {
    try {
      await softDeleteTransaction({ transactionId: transaction_id })
      await refreshTransactions()
      setOpenEditTransactionDialog(false)
      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "success",
        message: "Transaction deleted successfully",
      })
    } catch (error) {
      console.error(error)
      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "error",
        message: "Transaction could not be deleted",
      })
    }
  }

  useEffect(() => {
    refreshData()
  }, [refreshData])

  return (
    <TransactionContext.Provider
      value={{
        isTransactionsLoading,
        transactions,
        refreshTransactions,
        deletedTransactions,
        refreshDeletedTransactions,
        updateExistingTransaction,
        deleteExistingTransaction,
        alertToast,
        setAlertToast,
        selectedDate,
        setSelectedDate,
        selectedTransaction,
        setSelectedTransaction,
        openEditTransactionDialog,
        setOpenEditTransactionDialog,
        openNewTransactionDialog,
        setOpenNewTransactionDialog,
        newTransaction,
        setNewTransaction,
        saveNewTransaction,
        createInitialTransaction,
        moneyInputRef,
        openAddReturn,
        setOpenAddReturn,
        getReturnedAmount,
      }}
    >
      {props.children}
    </TransactionContext.Provider>
  )
}
