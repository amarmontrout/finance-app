import { currencyFormatter } from "@/global/formattingFunctions"
import { Stack, Typography } from "@mui/material"
import { useTransactionContext } from "../v2/TransactionsContext"
import TransactionExpenseViewToggle from "./_components/TransactionExpenseViewToggle"

const TransactionCardHeader = () => {
  const { displayType, expenseView, setExpenseView, isLoading, totalAmount } =
    useTransactionContext()

  return (
    <Stack
      direction={"row"}
      sx={{
        minHeight: 37,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography
        variant={"h5"}
        sx={{
          fontWeight: 700,
          color: "#102A1B",
          width: "100%",
        }}
      >
        {isLoading
          ? currencyFormatter.format(0)
          : currencyFormatter.format(totalAmount)}
      </Typography>

      {displayType === "Expense" && (
        <TransactionExpenseViewToggle
          expenseView={expenseView}
          setExpenseView={setExpenseView}
        />
      )}
    </Stack>
  )
}

export default TransactionCardHeader
