import { Box, Card, CardContent, Stack, Typography } from "@mui/material"

const ShowCaseCard = ({ children, title, secondaryTitle }: { children: React.ReactNode, title: string, secondaryTitle: string }) => {
  return (
    <Card
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "15px",
        minHeight: 0
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          flex: 1,
          px: 2,
          py: 3
        }}
      >
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="h4">{title}</Typography>

          <Typography variant="h5">{secondaryTitle}</Typography>
        </Stack>

        <hr style={{ width: "100%" }}/>

        <Box>
          {children}
        </Box>
      </CardContent>
    </Card>
  )
}

export default ShowCaseCard