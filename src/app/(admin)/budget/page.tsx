import { Metadata } from "next"
import V2Budget from "../v2/V2Budget"

export const metadata: Metadata = {
  title: "Budget Page",
}

const BudgetPage = () => {
  return <V2Budget />
}

export default BudgetPage
