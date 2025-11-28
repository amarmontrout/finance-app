import { Box, Card, CardContent, Typography } from "@mui/material"

const ShowCaseCard = ({ children, title }: { children: React.ReactNode, title: string }) => {
  return (
    <Card
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "15px"
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          px: 2,
          py: 3
        }}
      >
        <Typography>{title}</Typography>
        <hr style={{ width: "100%" }}/>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column"
          }}
        >
          {children}
        </Box>
      </CardContent>
    </Card>
  )
}

export default ShowCaseCard