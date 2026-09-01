import { V2TransactionType } from "@/api/v2/models"
import { getTransactionsTotal } from "@/global/dataFunctions"
import { currencyFormatter, isoToString } from "@/global/formattingFunctions"
import { Stack, Typography } from "@mui/material"

const TransactionCategoryHeader = ({
  transactions,
  date,
}: {
  transactions: V2TransactionType[]
  date: string
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
      <Typography sx={{ fontSize: 17, fontWeight: "bold" }}>
        {isoToString(date)}
      </Typography>

      <Typography sx={{ fontSize: 17, fontWeight: "bold" }}>
        {currencyFormatter.format(categoryTotal)}
      </Typography>
    </Stack>
  )
}

export default TransactionCategoryHeader
