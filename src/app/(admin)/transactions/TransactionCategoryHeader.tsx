import { TransactionType } from "@/api/transactions/models"
import { neutralColor } from "@/global/colors"
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
        borderColor: neutralColor,
      }}
    >
      <Typography sx={{ fontSize: 14 }}>
        {timestampToDateString(timestamp)}
      </Typography>

      <Typography sx={{ fontSize: 14 }}>
        ${numberToString(categoryTotal)}
      </Typography>
    </Stack>
  )
}

export default TransactionCategoryHeader
