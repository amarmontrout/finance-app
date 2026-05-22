import { Box, LinearProgress, Stack, Typography } from "@mui/material"

export function BudgetPaceProgressBar({
  label,
  total,
  spent,
  expected,
}: {
  label: string
  total: number
  spent: number
  expected: number
}) {
  const percentage = total === 0 ? 0 : (spent / total) * 100
  const safeTotal = Math.max(total, 1)

  const spentPercent = Math.min((spent / safeTotal) * 100, 100)
  const expectedPercent = Math.min((expected / safeTotal) * 100, 100)

  const isOverPace = spent > expected
  const variance = Math.abs(spent - expected)

  const getBarColor = () => {
    if (spentPercent < 75) return "success"
    if (spentPercent < 100) return "warning"
    return "error"
  }

  const getPaceColor = () => {
    if (isOverPace) return "error"
    return "success"
  }

  return (
    <Stack spacing={0.5}>
      <Stack
        direction={"row"}
        sx={{ justifyContent: "space-between", alignItems: "end" }}
      >
        <Typography variant={"h6"} sx={{ fontWeight: 700 }}>
          {label}
        </Typography>

        <Typography variant="caption">
          ${spent.toFixed(2)} / ${total.toFixed(2)}
        </Typography>
      </Stack>

      <Box position="relative">
        <LinearProgress
          variant={"determinate"}
          value={spentPercent}
          color={getBarColor()}
          sx={{ height: 10, borderRadius: 5 }}
        />

        <Box
          sx={{
            position: "absolute",
            top: -3,
            left: `calc(${expectedPercent}% - 1px)`,
            width: 2,
            height: 18,
            bgcolor: "text.primary",
            pointerEvents: "none",
          }}
        />
      </Box>

      <Stack direction={"row"} justifyContent={"space-between"}>
        <Typography variant={"caption"} color={getPaceColor()}>
          {isOverPace
            ? `$${variance.toFixed(0)} ahead of pace`
            : `$${variance.toFixed(0)} under pace`}
        </Typography>

        <Typography variant={"caption"}>
          {percentage.toFixed(1)}% used
        </Typography>
      </Stack>
    </Stack>
  )
}
