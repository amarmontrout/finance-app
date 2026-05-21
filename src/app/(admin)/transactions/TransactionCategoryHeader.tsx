import { TransactionType } from "@/api/transactions/models"
import { neutralColor } from "@/global/colors"
import { getTransactionsTotal } from "@/global/dataFunctions"
import { numberToString } from "@/global/formattingFunctions"
import { Stack, Typography } from "@mui/material"

const TransactionCategoryHeader = ({
  transactions,
  date,
}: {
  transactions: TransactionType[]
  date: string
}) => {
  const categoryTotal = getTransactionsTotal({ transactions: transactions })

  const formatDateLabel = (dateKey: string) =>
    new Date(dateKey).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })

  return (
    <Stack
      direction={"row"}
      sx={{
        justifyContent: "space-between",
        paddingX: 1,
        borderBottom: 2,
        borderColor: neutralColor,
      }}
    >
      <Typography sx={{ fontSize: 14 }}>{formatDateLabel(date)}</Typography>

      <Typography sx={{ fontSize: 14 }}>
        ${numberToString(categoryTotal)}
      </Typography>
    </Stack>
  )
}

export default TransactionCategoryHeader
