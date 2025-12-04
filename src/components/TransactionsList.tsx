import { TransactionData } from "@/utils/saveTransaction"
import { Chip, Stack, Typography } from "@mui/material"

const TransactionsList = (props:{
    type: "income" | "expenses"
    transactions: TransactionData
  }) => {
  const {type, transactions} = props

  const handleDeleteTransaction = (passedYear: string, passedMonth: string, passedId: string) => {
    Object.entries(transactions).map(([year, value]) => {
      if (year === passedYear) {
        Object.entries(value).map(([month, value]) => {
          if (month === passedMonth) {
            
          }
        })
      }
    })
  }

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
                      <Stack direction={"column"} gap={1}>
                        {transaction.map(({ id, category, amount}) => {
                          return (
                            <Chip key={id} label={`${category}: $${amount}`} onDelete={() => {handleDeleteTransaction(year, month, id)}}/>
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