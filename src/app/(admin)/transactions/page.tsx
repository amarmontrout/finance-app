import { Metadata } from "next"
import V2Transactions from "../v2/V2Transactions"

export const metadata: Metadata = {
  title: "Transaction Dashboard Page",
}

const TransactionDashboardPage = () => {
  return <V2Transactions />
}

export default TransactionDashboardPage
