import { CategoryType } from "@/app/(api)/categories/models"
import { TransactionType } from "@/app/(api)/transactions/models"
import ListItemSwipe from "@/app/components/ui/ListItemSwipe"
import { ACCENT_COLOR, TEXT_COLOR } from "@/app/data/colors"
import { currencyFormatter, formatDate } from "@/app/lib/functions/formatters"
import { HookSetter } from "@/app/lib/types"
import { Box, Stack, Typography } from "@mui/material"

const TransactionList = ({
  dateGroupedTransactions,
  categoryMap,
  deleteExistingTransaction,
  setSelectedTransaction,
  setOpenEditTransactionDialog,
  getReturnedAmount,
}: {
  dateGroupedTransactions: Record<string, TransactionType[]>
  categoryMap: Map<string, CategoryType>
  deleteExistingTransaction: (transaction_id: string) => Promise<void>
  setSelectedTransaction: HookSetter<TransactionType | null>
  setOpenEditTransactionDialog: HookSetter<boolean>
  getReturnedAmount: (transactionId: string) => number
}) => {
  return (
    <Stack direction={"column"} spacing={1}>
      {Object.entries(dateGroupedTransactions)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([date, entries]) => {
          const dateTotal = entries.reduce((total, transaction) => {
            if (
              transaction.transaction_type === "Expense" &&
              !transaction.is_paid
            ) {
              return total
            }

            return (
              total +
              transaction.amount -
              getReturnedAmount(transaction.transaction_id)
            )
          }, 0)

          return (
            <Box key={date}>
              <Stack direction={"column"} spacing={1}>
                <Stack
                  direction={"row"}
                  sx={{ justifyContent: "space-between", color: ACCENT_COLOR }}
                >
                  <Typography sx={{ fontSize: "1rem" }}>
                    {formatDate(date)}
                  </Typography>
                  <Typography sx={{ fontSize: "1rem" }}>
                    {currencyFormatter.format(dateTotal)}
                  </Typography>
                </Stack>

                <Stack direction={"column"} spacing={0.5}>
                  {entries
                    .toSorted((a, b) =>
                      a.merchant.name.localeCompare(b.merchant.name),
                    )
                    .map((t) => {
                      const returnedAmount = getReturnedAmount(t.transaction_id)
                      return (
                        <ListItemSwipe
                          key={t.transaction_id}
                          showAlert={
                            t.transaction_type === "Expense" &&
                            categoryMap.get(t.category_id!)
                              ?.default_transaction_type !== "Return" &&
                            !t.is_paid
                          }
                          mainTitle={t.merchant.name}
                          secondaryTitle={t.category.name}
                          hasReturn={returnedAmount > 0}
                          returnedAmount={currencyFormatter.format(
                            returnedAmount,
                          )}
                          amount={currencyFormatter.format(
                            t.amount - returnedAmount,
                          )}
                          amountColor={TEXT_COLOR}
                          categoryColor={categoryMap.get(t.category_id)?.color}
                          onDelete={() =>
                            deleteExistingTransaction(t.transaction_id)
                          }
                          onEdit={() => {
                            setSelectedTransaction(t)
                            setOpenEditTransactionDialog(true)
                          }}
                        />
                      )
                    })}
                </Stack>
              </Stack>
            </Box>
          )
        })}
    </Stack>
  )
}

export default TransactionList
