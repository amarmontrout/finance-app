import { Box } from "@mui/material"
import type { ReactNode } from "react"

type HorizontalScrollerProps = {
  children: ReactNode
  hideScrollbar?: boolean
}

export default function HorizontalScroller({
  children,
  hideScrollbar = false,
}: HorizontalScrollerProps) {
  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        overflowX: "auto",
        overflowY: "hidden",
        WebkitOverflowScrolling: "touch",
        ...(hideScrollbar && {
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }),
      }}
    >
      {children}
    </Box>
  )
}
