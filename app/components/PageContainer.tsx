import { Box } from "@mui/material"
import type { ReactNode } from "react"

type PageContainerProps = {
  children: ReactNode
}

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <Box
      sx={{
        width: "100%",
        p: 1,
      }}
    >
      {children}
    </Box>
  )
}
