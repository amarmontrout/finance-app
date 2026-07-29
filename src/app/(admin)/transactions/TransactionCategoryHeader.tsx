import { TransactionType } from "@/api/transactions/models"
import { getTransactionsTotal } from "@/global/dataFunctions"
import {
  numberToString,
  timestampToDateString,
} from "@/global/formattingFunctions"
import { Stack, Typography } from "@mui/material"

const TransactionCategoryHeader = ({
  transactions,
  timestamp,
}: {
  transactions: TransactionType[]
  timestamp: number
}) => {
  const categoryTotal = getTransactionsTotal({ transactions: transactions })

  return (
    <Stack
      direction={"row"}
      sx={{
        justifyContent: "space-between",
        paddingX: 1,
        borderBottom: 2,
        color: "#102A1B",
      }}
    >
      <Typography sx={{ fontSize: 17 }}>
        {timestampToDateString(timestamp)}
      </Typography>

      <Typography sx={{ fontSize: 17 }}>
        ${numberToString(categoryTotal)}
      </Typography>
    </Stack>
  )
}

export default TransactionCategoryHeader
