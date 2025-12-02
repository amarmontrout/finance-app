import { TransactionType } from "@/components/TransactionForm"

export type TransactionData = {[year: string]: {[month: string]: Array<{category: string, amount: string}>}}

const saveTransaction = (props: {
  key: string,
  transaction: TransactionType
}) => {
  const { key, transaction } = props
  const currentTransactionData = localStorage.getItem(key)
  let transactionData: TransactionData = {}

  if(currentTransactionData) {
    try {
      transactionData = JSON.parse(currentTransactionData) as TransactionData
    } catch (error) {
      console.error("Failed to parse current transaction data", error)
    }
  }

  if (transaction) {
    try {
      const { month, year, category, amount } = transaction

      if (!transactionData[year]) {
        transactionData[year] = {}
      }

      if (!transactionData[year][month]) {
        transactionData[year][month] = []
      }

      transactionData[year][month].push({
        category,
        amount
      })

      localStorage.setItem(key, JSON.stringify(transactionData));
      console.log("Transaction saved");
    } catch (error) {
      console.error("Failed to save transaction", error)
    }
  }
  console.log("No transaction data found")
  return null
}

export default saveTransaction