import { Box } from "@mui/material"
import { SxProps, Theme } from "@mui/material/styles"
import type { ReactNode } from "react"

type CenterProps = {
  children: ReactNode
  sx?: SxProps<Theme>
}

export default function Center({ children, sx }: CenterProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}
