import { Metadata } from "next";
import MonthlySummary from "./MonthlySummary";

export const metadata: Metadata = {
  title: "Monthly Summary Page",
};

const MonthlySummaryPage = () => {
  return <MonthlySummary />;
};

export default MonthlySummaryPage;
