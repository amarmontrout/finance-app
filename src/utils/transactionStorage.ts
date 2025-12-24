import { TransactionType } from "@/components/TransactionForm"
import { MONTHS } from "@/globals/globals"
import { makeId } from "./helperFunctions"

export type TransactionData = {[year: string]: {[month: string]: Array<{id: string, category: string, amount: string}>}}

export const saveTransaction = (props: {
  key: string
  transaction?: TransactionType
  updatedTransactionData?: TransactionData
}) => {
  const { key, transaction, updatedTransactionData } = props
  const currentTransactionData = localStorage.getItem(key)
  let transactionData: TransactionData = {}

  const sortMonths = (data: TransactionData): TransactionData => {
    const sortedData: TransactionData = {};

    for (const year of Object.keys(data)) {
      const monthsObj = data[year];
      const sortedMonthsObj: TransactionData[string] = {};

      MONTHS.forEach((month) => {
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
      const id = makeId(8)

      if (!transactionData[year]) {
        transactionData[year] = {}
      }

      if (!transactionData[year][month]) {
        transactionData[year][month] = []
      }

      transactionData[year][month].push({
        id,
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

  if (updatedTransactionData) {
    try {
      localStorage.setItem(key, JSON.stringify(updatedTransactionData));
      console.log("Transaction saved");
    } catch (error) {
      console.error("Failed to save transaction", error)
    }
  }
  console.log("No transaction data found")
  return null
}

export const getTransactions = (props: {
  key: string
}) => {
  const { key } = props
  const localData = localStorage.getItem(key)

  if (localData) {
    try {
      return JSON.parse(localData) as TransactionData
    } catch (error) {
      console.log("Could not parse local data", error)
      return null
    }
  }
  console.log("No local data found")
  return null
}