import { Box } from "@mui/material"

export const FlexColWrapper = ({
  children,
  gap,
  toRowBreak,
}: {
  children: React.ReactNode
  gap?: number | undefined
  toRowBreak?: "sm" | "md" | "lg" | "xl" | "2xl" | undefined
}) => {
  const toRow = toRowBreak ? `${toRowBreak}:flex-row` : ""
  const hasGap = gap ? `gap-${gap}` : ""
  return <Box className={`flex flex-col ${hasGap} ${toRow}`}>{children}</Box>
}
