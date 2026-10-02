import { Box } from "@mui/material"

const SummaryCard = ({
  children,
  borderColor,
  padding,
  minHeight,
}: {
  children: React.ReactNode
  borderColor: string
  padding: number
  minHeight?: string | undefined
}) => (
  <Box
    sx={{
      backgroundColor: "background.paper",
      border: `1px solid ${borderColor}`,
      borderRadius: 2,
      padding: padding,
      width: "100%",
      minHeight: minHeight,
    }}
  >
    {children}
  </Box>
)

export default SummaryCard
