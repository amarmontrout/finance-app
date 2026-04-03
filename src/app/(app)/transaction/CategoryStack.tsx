import { toTimestamp } from "@/utils/helperFunctions"
import { Stack } from "@mui/material"
import CategoryHeader from "./CategoryHeader"
import CategoryList from "./CategoryList"
import { useMemo, useState } from "react"
import { AlertToastType, HookSetter, TransactionType } from "@/utils/type"

const CategoryStack = ({
  filteredTransactions,
  selectedTransaction,
  setSelectedTransaction,
  refreshTransactions,
  openDialog,
  setOpenDialog,
  setAlertToast,
  currentTheme,
}: {
  filteredTransactions: TransactionType[]
  selectedTransaction: TransactionType | null
  setSelectedTransaction: HookSetter<TransactionType | null>
  refreshTransactions: () => Promise<void>
  openDialog: boolean
  setOpenDialog: HookSetter<boolean>
  setAlertToast: HookSetter<AlertToastType | undefined>
  currentTheme: string | undefined
}) => {
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({})

  const groupedTransactions = useMemo(() => {
    return filteredTransactions.reduce<Record<string, TransactionType[]>>(
      (acc, transaction) => {
        const category = transaction.category
        if (!acc[category]) acc[category] = []
        acc[category].push(transaction)
        return acc
      },
      {},
    )
  }, [filteredTransactions])

  const sortedCategories = useMemo(() => {
    return Object.entries(groupedTransactions).sort(([a], [b]) =>
      a.localeCompare(b),
    )
  }, [groupedTransactions])

  return (
    <Stack spacing={2}>
      {sortedCategories.map(([category, entries]) => {
        const sortedEntries = [...entries].sort(
          (a, b) => toTimestamp(b.date) - toTimestamp(a.date),
        )
        const isExpanded = expandedCategories[category]

        return (
          <Stack key={category} spacing={0.5}>
            <CategoryHeader
              entries={entries}
              sortedEntries={sortedEntries}
              setExpandedCategories={setExpandedCategories}
              category={category}
              isExpanded={isExpanded}
            />

            <CategoryList
              sortedEntries={sortedEntries}
              selectedTransaction={selectedTransaction}
              setSelectedTransaction={setSelectedTransaction}
              refreshTransactions={refreshTransactions}
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              setAlertToast={setAlertToast}
              isExpanded={isExpanded}
              currentTheme={currentTheme}
            />
          </Stack>
        )
      })}
    </Stack>
  )
}

export default CategoryStack
