import ShowCaseCard from "@/components/ShowCaseCard";
import { Box } from "@mui/material";
import OverviewInfo from "./OverviewInfo";

export default function Home() {
  return (
    <Box
      display={"flex"}
      flex={1}
      justifyContent={"center"}
      alignItems={"center"}
      padding={"50px"}
    >
      <ShowCaseCard title={"Overview"} secondaryTitle={""}>
        <Box marginTop={"10px"}>
          <OverviewInfo/>
        </Box>
      </ShowCaseCard>
    </Box>
  );
}
