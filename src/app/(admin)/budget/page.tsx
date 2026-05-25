import { Metadata } from "next"
import Budget from "./Budget"

export const metadata: Metadata = {
  title: "Budget Page",
}

const BudgetPage = () => {
  return <Budget />
}

export default BudgetPage
