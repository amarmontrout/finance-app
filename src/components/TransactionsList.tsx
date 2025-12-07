import saveTransaction, { TransactionData } from "@/utils/saveTransaction"
import { Chip, Stack, Typography } from "@mui/material"

const TransactionsList = (props:{
    type: "income" | "expenses"
    transactions: TransactionData
    refreshTransactions: () => void
  }) => {
  const {type, transactions, refreshTransactions} = props

  const handleDeleteTransaction = (passedYear: string, passedMonth: string, passedId: string) => {
    const updated = {...transactions}
    
    if (updated[passedYear] && updated[passedYear][passedMonth]) {
      updated[passedYear][passedMonth] = updated[passedYear][passedMonth].filter(
        (transaction) => transaction.id !== passedId
      )

      if (updated[passedYear][passedMonth].length === 0) {
        delete updated[passedYear][passedMonth];
      }

      if (Object.keys(updated[passedYear]).length === 0) {
        delete updated[passedYear];
      }

      console.log("Updated:", updated);
      saveTransaction({key: type, updatedTransactionData: updated})
      refreshTransactions()
    } else {
      console.warn("Year or month not found in records.");
    }
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