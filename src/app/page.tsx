import ShowCaseCard from "@/components/ShowCaseCard";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <Box
      display={"flex"}
      flex={1}
      justifyContent={"center"}
      alignItems={"center"}
      padding={"50px"}
    >
      <ShowCaseCard title={"Overview"}>
        Content
      </ShowCaseCard>
    </Box>
  );
}
