import { Box } from "@mui/material"
import type { ReactNode } from "react"

type SectionProps = {
  children: ReactNode
}

export default function Section({ children }: SectionProps) {
  return (
    <Box
      component={"section"}
      sx={{
        mb: 2,
      }}
    >
      {children}
    </Box>
  )
}
