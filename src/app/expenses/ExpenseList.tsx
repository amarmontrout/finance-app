import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionsList from "@/components/TransactionsList"
import { getMonthTotal } from "@/utils/getTotals"
import { TransactionData } from "@/utils/transactionStorage"
import { useMemo } from "react"

const ExpenseList = ({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  expenses,
  expenseTransactions,
  refreshExpenseTransactions,
  setOpenEditDialog,
  setSelectedId,
  excludedSet,
}: {
  selectedMonth: string
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>
  selectedYear: string
  setSelectedYear: React.Dispatch<React.SetStateAction<string>>
  expenses: "expenses"
  expenseTransactions: TransactionData
  refreshExpenseTransactions: () => void
  setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedId: React.Dispatch<React.SetStateAction<string>>
  excludedSet: Set<string>
}) => {
  const monthExpense = useMemo(() => {
    return getMonthTotal(
      selectedYear, 
      selectedMonth, 
      expenseTransactions,
      excludedSet
    )
  }, [selectedYear, selectedMonth, expenseTransactions])

  return (
    <ShowCaseCard
      title={`Expenses for ${selectedMonth} ${selectedYear}`} 
      secondaryTitle={`$${monthExpense}`}
    >
      <TransactionsList
        type={expenses}
        transactions={expenseTransactions}
        refreshTransactions={refreshExpenseTransactions}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        setOpenEditDialog={setOpenEditDialog}
        setSelectedId={setSelectedId}
        excludedSet={excludedSet}
      />
    </ShowCaseCard>
  )
}

export default ExpenseList