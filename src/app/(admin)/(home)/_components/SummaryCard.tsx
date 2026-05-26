import {
  infoColor,
  negativeColor,
  neutralColor,
  positiveColor,
} from "@/global/colors"
import { numberToString } from "@/global/formattingFunctions"
import { Box, Stack, Typography } from "@mui/material"

export const SummaryCard = ({
  title,
  amount,
  comparison,
  type,
}: {
  title: string
  amount: number
  comparison?: number
  type: "income" | "expense" | "net" | "total"
}) => {
  const typeStyles = {
    income: {
      main: positiveColor.color,
      bg: positiveColor.bg,
    },
    expense: {
      main: negativeColor.color,
      bg: negativeColor.bg,
    },
    net: {
      main: neutralColor.color,
      bg: neutralColor.bg,
    },
    total: {
      main: infoColor.color,
      bg: infoColor.bg,
    },
  }
  const style = typeStyles[type]
  const diff = comparison !== undefined ? amount - comparison : undefined
  const isPositive = diff !== undefined && diff >= 0

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: 2,
        border: "2px solid rgba(0,0,0,0.2)",
        bgcolor: style.bg,
        paddingY: 1,
        paddingX: 2,
      }}
    >
      <Stack direction={"column"}>
        {/* Title */}
        <Typography
          variant={"caption"}
          sx={{ fontWeight: 600, color: style.main }}
        >
          {title}
        </Typography>

        {/* Amount */}
        <Typography
          variant={"h5"}
          sx={{ fontWeight: 600, color: style.main, textAlign: "left" }}
        >
          ${numberToString(amount)}
        </Typography>

        {/* Comparison */}
        {comparison !== undefined && (
          <Typography variant={"caption"} sx={{ textAlign: "right" }}>
            <span style={{ fontWeight: 700 }}>
              ${numberToString(Math.abs(diff!))} {isPositive ? "more" : "less"}
            </span>{" "}
            than last month
          </Typography>
        )}
      </Stack>
    </Box>
  )
}
