import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionsList from "@/components/TransactionsList"
import { getMonthTotalV2 } from "@/utils/getTotals"
import { HookSetter, TransactionTypeV2 } from "@/utils/type"
import { useMemo } from "react"

const IncomeList = ({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  income,
  incomeTransactions,
  refreshIncomeTransactions,
  setOpenEditDialog,
  setSelectedId,
  excludedSet,
}: {
  selectedMonth: string
  setSelectedMonth: HookSetter<string>
  selectedYear: string
  setSelectedYear: HookSetter<string>
  income: "income" | "expenses"
  incomeTransactions: TransactionTypeV2[]
  refreshIncomeTransactions: () => void
  setOpenEditDialog: HookSetter<boolean>
  setSelectedId: HookSetter<number | null>
  excludedSet: Set<string>
}) => {
  const monthIncome = useMemo(() => {
    return getMonthTotalV2(
      Number(selectedYear), 
      selectedMonth, 
      incomeTransactions, 
      excludedSet
    )
  }, [selectedYear, selectedMonth, incomeTransactions])

  return (
    <ShowCaseCard
      title={`Income for ${selectedMonth} ${selectedYear}`} 
      secondaryTitle={`$${monthIncome}`}
    >
      <TransactionsList
        type={income}
        transactions={incomeTransactions}
        refreshTransactions={refreshIncomeTransactions}
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

export default IncomeList