import { useTransactionContext } from "@/contexts/transactions-context"
import { Alert, Box } from "@mui/material"

const MockDataWarning = (props: {
  pathname?: string
}) => {
  const {
    pathname
  } = props

  const { 
    isMockData,
  } = useTransactionContext()

  if (pathname === "/income") {
    return (
      <Box
        sx={{
          display: isMockData.income || isMockData.years? "flex" : "none",
          height: "100%",
          alignItems: "center"
        }}
      >
        <Alert severity="error" sx={{width: "100%"}}>
          This contains mock data. 
          Go to settings and add a year and/or an income category. 
          Then come back here to enter your first income transaction.
        </Alert>
      </Box>
    )
  } else if (pathname === "/expenses") {
    return (
      <Box
        sx={{
          display: isMockData.expenses || isMockData.years? "flex" : "none",
          height: "100%",
          alignItems: "center"
        }}
      >
        <Alert severity="error" sx={{width: "100%"}}>
          This contains mock data. 
          Go to settings and add a year and/or an expense category. 
          Then come back here to enter your first expense transaction.
        </Alert>
      </Box>      
    )
  } else {
    return (     
      <Box
        sx={{
          display: isMockData.income || isMockData.expenses || isMockData.years? "flex" : "none",
          height: "100%",
          alignItems: "center"
        }}
      >
        <Alert severity="error" sx={{width: "100%"}}>
          This contains mock data for demonstration purposes.
          Add your first income and expense transactions to start tracking your finances.
        </Alert>
      </Box>
    )  
  }
}

export default MockDataWarning