import { Metadata } from "next"
import CreditCardEstimate from "./CreditCardEstimate"

export const metadata: Metadata = {
  title: "Credit Card Estimate Page",
}

const CreditCardEstimatePage = () => {
  return <CreditCardEstimate />
}

export default CreditCardEstimatePage
