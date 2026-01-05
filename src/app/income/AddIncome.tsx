import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionForm from "@/components/TransactionForm"
import { Choice } from "@/contexts/categories-context"

const AddIncome = ({
  incomeCategories,
  income,
  refreshIncomeTransactions,
  years
}: {
  incomeCategories: Choice[]
  income: string
  refreshIncomeTransactions: () => void
  years: Choice[]
}) => {
  return (
    <ShowCaseCard title={"Add Income"}>
      <TransactionForm
        categories={incomeCategories}
        type={income}
        refreshTransactions={refreshIncomeTransactions}
        years={years}
      />
    </ShowCaseCard>
  )
}

export default AddIncome