import { Stack } from "@mui/material";
import { Metadata } from "next";
import MonthlyProgress from "./MonthlyProgress";

export const metadata: Metadata = {
  title: "Budget Progress Page",
};

const BudgetProgressPage = () => {
  return (
    <Stack direction={"column"} spacing={3}>
      <MonthlyProgress />
      {/* <WeeklyProgress /> */}
    </Stack>
  );
};

export default BudgetProgressPage;
