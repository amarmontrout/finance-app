import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionForm from "@/components/TransactionForm"
import { ChoiceTypeV2 } from "@/utils/type"

const AddExpenses = ({
  expenseCategories,
  expenses,
  refreshExpenseTransactions,
  years
}: {
  expenseCategories: ChoiceTypeV2[]
  expenses: "expenses"
  refreshExpenseTransactions: () => void
  years: ChoiceTypeV2[]
}) => {
  return (
    <ShowCaseCard title={"Add Expense V2"}>
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