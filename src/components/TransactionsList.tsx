import { TransactionData } from "@/utils/saveTransaction"
import { Stack, Typography } from "@mui/material"

const TransactionsList = (props:{
    transactions: TransactionData
  }) => {
  const {transactions} = props

  return (
    <Stack direction={"row"} gap={2}>
      {
        Object.entries(transactions).map(([year, months]) => {
          return (
            <Stack key={year} direction={"row"} gap={1}>
              <Typography>{year}:</Typography>
              <Stack direction={"column"} gap={2}>
                {Object.entries(months).map(([month, transaction]) => {
                  return (
                    <Stack key={month} direction={"row"} gap={1} justifyContent={"space-between"}>
                      <Typography>{month}:</Typography>
                      <Stack direction={"column"}>
                        {transaction.map(({ category, amount}, idx) => {
                          return (
                            <Stack key={`${idx}-${category}-${amount}`} direction={"row"} gap={1}>
                              <Typography>{category}</Typography>
                              <Typography>{amount}</Typography>
                              <button onClick={() => {alert(idx)}}>X</button>
                            </Stack>
                          )
                        })}
                      </Stack>
                    </Stack>
                  )
                })}
              </Stack>
            </Stack>
          )
        })
      }
    </Stack>
  )
}

export default TransactionsList