import { accentColorPrimary } from "@/globals/colors"
import { Box } from "@mui/material"
import PaidIcon from '@mui/icons-material/Paid';
import SavingsIcon from '@mui/icons-material/Savings';
import CreditCardIcon from '@mui/icons-material/CreditCard';

const Logo = () => {
  return (
    <Box 
      bgcolor={"background.paper"} 
      border={`2px solid ${accentColorPrimary}`} 
      borderRadius={"15px"} 
      width={"fit-content"} 
      height={"fit-content"} 
      padding={"15px 25px 15px 25px"}
    >
      <PaidIcon fontSize={"large"} />
      <SavingsIcon fontSize={"large"} />
      <CreditCardIcon fontSize={"large"} />
    </Box>
  )
}

export default Logo 