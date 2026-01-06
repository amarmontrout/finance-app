import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionForm from "@/components/TransactionForm"
import { Choice } from "@/contexts/categories-context"

const AddExpenses = ({
  expenseCategories,
  expenses,
  refreshExpenseTransactions,
  years
}: {
  expenseCategories: Choice[]
  expenses: "expenses"
  refreshExpenseTransactions: () => void
  years: Choice[]
}) => {
  return (
    <ShowCaseCard title={"Add Expense"}>
      <TransactionForm
        categories={expenseCategories}
        type={expenses}
        refreshTransactions={refreshExpenseTransactions}
        years={years}
      />
    </ShowCaseCard>
  )
}

export default AddExpenses