import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionForm from "@/components/TransactionForm"
import { ChoiceTypeV2 } from "@/utils/type"

const AddIncome = ({
  incomeCategories,
  income,
  refreshIncomeTransactions,
  years
}: {
  incomeCategories: ChoiceTypeV2[]
  income: "income"
  refreshIncomeTransactions: () => void
  years: ChoiceTypeV2[]
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