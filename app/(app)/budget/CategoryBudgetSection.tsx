import { BudgetType } from "@/app/(api)/budgets/models"
import { TransactionType } from "@/app/(api)/transactions/models"
import ListItemSwipe from "@/app/components/ui/ListItemSwipe"
import ProgressBar from "@/app/components/ui/ProgressBar"
import Surface from "@/app/components/ui/Surface"
import { useDataContext } from "@/app/contexts/data-context"
import { useTransactionContext } from "@/app/contexts/transaction-context"
import { TEXT_COLOR } from "@/app/data/colors"
import { currencyFormatter, formatDate } from "@/app/lib/functions/formatters"
import { getBudgetInfo, getISODate } from "@/app/lib/functions/getters"
import { HookSetter } from "@/app/lib/types"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { Divider, IconButton, Stack } from "@mui/material"

const CategoryBudgetSection = ({
  entries,
  budget,
  expandedCategory,
  setExpandedCategory,
  categoryId,
  isCurrentMonth,
  budgetLookup,
}: {
  entries: TransactionType[]
  budget: BudgetType
  expandedCategory: string | undefined
  setExpandedCategory: HookSetter<string | undefined>
  categoryId: string
  isCurrentMonth: boolean
  budgetLookup: Record<string, BudgetType>
}) => {
  const { categoryMap, setOpenAddBudget, setBudgetToEdit } = useDataContext()
  const {
    deleteExistingTransaction,
    setSelectedTransaction,
    setOpenEditTransactionDialog,
    getReturnedAmount,
  } = useTransactionContext()

  const actualTotal = entries.reduce(
    (total, transaction) =>
      total +
      transaction.amount -
      getReturnedAmount(transaction.transaction_id),
    0,
  )

  const { earnedBudget } = getBudgetInfo({
    budget: budget.amount,
    spent: actualTotal,
    date: getISODate(),
  })

  const expandCategory = (categoryId: string) => {
    expandedCategory === categoryId
      ? setExpandedCategory(undefined)
      : setExpandedCategory(categoryId)
  }

  return (
    <Surface>
      <Stack direction={"column"} spacing={1}>
        <Stack direction={"row"} sx={{ alignItems: "center" }}>
          <ProgressBar
            label={categoryMap.get(categoryId)?.name ?? ""}
            budget={budget.amount}
            actual={actualTotal}
            expected={isCurrentMonth ? earnedBudget : undefined}
            onEdit={
              isCurrentMonth
                ? () => {
                    setOpenAddBudget(true)
                    setBudgetToEdit(budgetLookup[categoryId])
                  }
                : undefined
            }
          />

          <IconButton
            sx={{ width: 25, height: 25 }}
            onClick={() => expandCategory(categoryId)}
          >
            {expandedCategory === categoryId ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )}
          </IconButton>
        </Stack>

        {expandedCategory === categoryId && (
          <Stack
            direction={"column"}
            sx={{ paddingX: 0.5 }}
            divider={
              <Divider
                orientation={"horizontal"}
                sx={{ borderColor: TEXT_COLOR }}
              />
            }
          >
            {entries
              .toSorted((a, b) =>
                b.transaction_date.localeCompare(a.transaction_date),
              )
              .map((t) => {
                const returnedAmount = getReturnedAmount(t.transaction_id)
                return (
                  <ListItemSwipe
                    key={t.transaction_id}
                    mainTitle={t.merchant.name}
                    secondaryTitle={formatDate(t.transaction_date)}
                    hasReturn={returnedAmount > 0}
                    returnedAmount={currencyFormatter.format(returnedAmount)}
                    amount={currencyFormatter.format(t.amount - returnedAmount)}
                    amountColor={TEXT_COLOR}
                    categoryColor={categoryMap.get(t.category_id)?.color}
                    onDelete={() => deleteExistingTransaction(t.transaction_id)}
                    onEdit={() => {
                      setSelectedTransaction(t)
                      setOpenEditTransactionDialog(true)
                    }}
                  />
                )
              })}
          </Stack>
        )}
      </Stack>
    </Surface>
  )
}

export default CategoryBudgetSection
