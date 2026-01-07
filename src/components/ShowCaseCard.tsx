import { Box, Card, CardContent, Stack, Typography } from "@mui/material"

const ShowCaseCard = ({ 
  children, 
  title, 
  secondaryTitle 
}: { 
  children: React.ReactNode, 
  title: string, 
  secondaryTitle?: string 
}) => {
  return (
    <Card
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "15px"
      }}
    >
      <CardContent>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography 
            sx={{
              fontSize: { xs: "1rem", sm: "1.5rem" },
            }}
          >
              {title}
          </Typography>

          <Typography 
            sx={{
              fontSize: { xs: "1rem", sm: "1.5rem" },
            }}
          >
            {secondaryTitle}
          </Typography>
        </Stack>

        <hr/>
        
        <Box paddingTop={"10px"}>
          {children}
        </Box>
      </CardContent>
    </Card>
  )
}

export default ShowCaseCard