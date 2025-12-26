import { Box } from "@mui/material"

export const FlexColWrapper = (props: {
  children: React.ReactNode
  gap?: number | undefined
  toRowBreak?: "sm" | "md" | "lg" | "xl" | "2xl" | undefined
}) => {
  const { children, gap, toRowBreak } = props
  const toRow = toRowBreak ? `${toRowBreak}:flex-row` : ""
  const hasGap = gap ? `gap-${gap}` : ""
  return (
    <Box
      className={`flex flex-col ${hasGap} ${toRow} h-full`}
    >
      {children}
    </Box>
  )
}

export const FlexRowWrapper = (props: {
  children: React.ReactNode
  gap?: number | undefined
  toColBreak?: "sm" | "md" | "lg" | "xl" | "2xl" | undefined
}) => {
  const { children, gap, toColBreak } = props
  const toCol = toColBreak ? `${toColBreak}:flex-row` : ""
  const hasGap = gap ? `gap-${gap}` : ""
  return (
    <Box
      className={`flex flex-row ${hasGap} ${toCol} h-full`}
    >
      {children}
    </Box>
  )
}

export const FlexChildWrapper = (props: {
  children: React.ReactNode
  gap?: number | undefined
  hiddenToVisibleBp?: "sm" | "md" | "lg" | "xl" | "2xl" | undefined
}) => {
  const { children, gap, hiddenToVisibleBp } = props
  const hasGap = gap ? `gap-${gap}` : ""
  const hiddenToVisible = hiddenToVisibleBp ? `hidden ${hiddenToVisibleBp}:flex` : "flex"
  return (
    <Box
      className={`${hiddenToVisible} flex-1 flex-col ${hasGap} min-w-0 h-full`}
    >
      {children}
    </Box>
  )
}