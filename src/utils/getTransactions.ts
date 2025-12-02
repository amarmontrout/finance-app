import { TransactionData } from "./saveTransaction"

const getTransactions = (props: {
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

export default getTransactions