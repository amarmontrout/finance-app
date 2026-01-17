import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionsList from "@/components/TransactionsList"
import { getMonthTotalV2 } from "@/utils/getTotals"
import { HookSetter, TransactionTypeV2 } from "@/utils/type"
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
  setSelectedMonth: HookSetter<string>
  selectedYear: string
  setSelectedYear: HookSetter<string>
  expenses: "expenses"
  expenseTransactions: TransactionTypeV2[]
  refreshExpenseTransactions: () => void
  setOpenEditDialog: HookSetter<boolean>
  setSelectedId: HookSetter<number | null>
  excludedSet: Set<string>
}) => {
  const monthExpense = useMemo(() => {
    return getMonthTotalV2(
      Number(selectedYear), 
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