import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionsList from "@/components/TransactionsList"
import { getMonthTotalV2 } from "@/utils/getTotals"
import { TransactionTypeV2 } from "@/utils/type"
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
  expenseTransactions: TransactionTypeV2[]
  refreshExpenseTransactions: () => void
  setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>
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
      title={`Expenses for ${selectedMonth} ${selectedYear} V2`} 
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