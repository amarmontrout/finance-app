import { Metadata } from "next"
import V2Home from "../v2/V2Home"

export const metadata: Metadata = {
  title: "Monthly Summary Page",
}

const MonthlySummaryPage = () => {
  return <V2Home />
}

export default MonthlySummaryPage
