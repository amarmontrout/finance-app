import { Metadata } from "next";
import Insights from "./Insights";

export const metadata: Metadata = {
  title: "View Insights Page",
};

const ViewInsightsPage = () => {
  return <Insights />;
};

export default ViewInsightsPage;
