import { TransactionType } from "@/components/TransactionForm"
import { months } from "@/globals/globals"

export type TransactionData = {[year: string]: {[month: string]: Array<{category: string, amount: string}>}}

const saveTransaction = (props: {
  key: string,
  transaction: TransactionType
}) => {
  const { key, transaction } = props
  const currentTransactionData = localStorage.getItem(key)
  let transactionData: TransactionData = {}

  const sortMonths = (data: TransactionData): TransactionData => {
    const sortedData: TransactionData = {};

    for (const year of Object.keys(data)) {
      const monthsObj = data[year];
      const sortedMonthsObj: TransactionData[string] = {};

      months.forEach((month) => {
        if (monthsObj[month]) {
          sortedMonthsObj[month] = monthsObj[month];
        }
      });

      sortedData[year] = sortedMonthsObj;
    }

    return sortedData;
  };

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

      const sortedTransactionData = sortMonths(transactionData)
      localStorage.setItem(key, JSON.stringify(sortedTransactionData));
      console.log("Transaction saved");
    } catch (error) {
      console.error("Failed to save transaction", error)
    }
  }
  console.log("No transaction data found")
  return null
}

export default saveTransaction