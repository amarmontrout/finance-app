import { Box } from "@mui/material"
import { PropsWithChildren } from "react"

const AppCard = ({ children }: PropsWithChildren) => {
  return (
    <Box
      bgcolor={"rgba(255,255,255,0.15)"}
      borderRadius={5}
      minHeight={"150px"}
      padding={2}
    >
      {children}
    </Box>
  )
}

export default AppCard
