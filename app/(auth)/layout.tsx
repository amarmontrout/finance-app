import { Box } from "@mui/material"
import type { PropsWithChildren } from "react"

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <Box
      component={"main"}
      sx={{
        height: "100dvh",
        bgcolor: "background.default",
      }}
    >
      {children}
    </Box>
  )
}
