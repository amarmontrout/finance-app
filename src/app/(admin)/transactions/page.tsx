import { Metadata } from "next"
import Transactions from "./Transactions"

export const metadata: Metadata = {
  title: "Transaction Dashboard Page",
}

const TransactionDashboardPage = () => {
  return <Transactions />
}

export default TransactionDashboardPage
