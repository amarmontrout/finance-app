import { AccountTypeValue } from "@/app/(api)/accounts/models"
import { TransactionTypeValue } from "@/app/(api)/transactions/models"
import TransactionExpenseToggle from "@/app/components/inputs/TransactionExpenseToggle"
import { currencyFormatter } from "@/app/lib/functions/formatters"
import { HookSetter } from "@/app/lib/types"
import { Stack, Typography } from "@mui/material"

const TransactionsHeader = ({
  filteredTotal,
  transactionType,
  expenseType,
  setExpenseType,
}: {
  filteredTotal: number
  transactionType: TransactionTypeValue
  expenseType: AccountTypeValue[]
  setExpenseType: HookSetter<AccountTypeValue[]>
}) => {
  return (
    <Stack
      direction={"row"}
      sx={{
        minHeight: 37,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant={"h5"} sx={{ fontWeight: 700, width: "100%" }}>
        {currencyFormatter.format(filteredTotal)}
      </Typography>

      {transactionType === "Expense" && (
        <TransactionExpenseToggle
          expenseType={expenseType}
          setExpenseType={setExpenseType}
        />
      )}
    </Stack>
  )
}

export default TransactionsHeader
