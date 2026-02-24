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

export const FlexRowWrapper = ({
  children,
  gap,
  toColBreak,
}: {
  children: React.ReactNode
  gap?: number | undefined
  toColBreak?: "sm" | "md" | "lg" | "xl" | "2xl" | undefined
}) => {
  const toCol = toColBreak ? `${toColBreak}:flex-row` : ""
  const hasGap = gap ? `gap-${gap}` : ""
  return <Box className={`flex flex-row ${hasGap} ${toCol}`}>{children}</Box>
}

export const FlexChildWrapper = ({
  children,
  gap,
  hiddenToVisibleBp,
}: {
  children: React.ReactNode
  gap?: number | undefined
  hiddenToVisibleBp?: "sm" | "md" | "lg" | "xl" | "2xl" | undefined
}) => {
  const hasGap = gap ? `gap-${gap}` : ""
  const hiddenToVisible = hiddenToVisibleBp
    ? `hidden ${hiddenToVisibleBp}:flex`
    : "flex"
  return (
    <Box className={`${hiddenToVisible} flex-1 flex-col ${hasGap} min-w-0`}>
      {children}
    </Box>
  )
}
