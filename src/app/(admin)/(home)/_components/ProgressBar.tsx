import { negativeColor, positiveColor } from "@/global/colors"
import EditIcon from "@mui/icons-material/Edit"
import {
  Box,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material"
import { useMemo } from "react"

const BudgetProgressBar = ({
  label,
  actual,
  budget,
  expected,
  onEdit,
}: {
  label: string
  actual: number
  budget: number
  expected?: number
  onEdit?: () => void
}) => {
  const safeTotal = Math.max(budget, 1)
  const spentPercent = budget === 0 ? 0 : Math.min((actual / budget) * 100, 100)

  const { expectedPercent, isOverPace, variance } = useMemo(() => {
    if (!expected) {
      return {
        expectedPercent: 0,
        isOverPace: false,
        variance: 0,
      }
    }

    return {
      expectedPercent: Math.min((expected / safeTotal) * 100, 100),
      isOverPace: actual > expected,
      variance: Math.abs(actual - expected),
    }
  }, [actual, expected, safeTotal])

  const getBarColor = () => {
    if (spentPercent < 75) return "success"
    if (spentPercent < 100) return "warning"
    return "error"
  }

  const getPaceColor = () => {
    if (isOverPace) return negativeColor.color
    return positiveColor.color
  }

  return (
    <Stack spacing={0.5}>
      <Stack
        direction={"row"}
        sx={{
          justifyContent: "space-between",
          alignItems: "end",
        }}
      >
        <Stack direction={"row"} spacing={1} sx={{ alignItems: "center" }}>
          <Typography variant={"h6"} sx={{ fontWeight: 700 }}>
            {label}
          </Typography>

          {onEdit && (
            <IconButton
              className="text-dark-4 dark:text-dark-6"
              sx={{ width: "20px", height: "20px" }}
              disableRipple
              onClick={onEdit}
            >
              <EditIcon sx={{ fontSize: "20px" }} />
            </IconButton>
          )}
        </Stack>

        <Typography variant="caption">
          ${actual.toFixed(2)} / ${budget.toFixed(2)}
        </Typography>
      </Stack>

      <Box position="relative">
        <LinearProgress
          variant={"determinate"}
          value={spentPercent}
          color={getBarColor()}
          sx={{ height: 10, borderRadius: 5 }}
        />

        {expected && (
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
        )}
      </Box>

      <Stack
        direction={"row"}
        justifyContent={expected ? "space-between" : "flex-end"}
      >
        {expected && (
          <Typography
            variant={"caption"}
            color={getPaceColor()}
            sx={{ fontWeight: 700 }}
          >
            {isOverPace
              ? `$${variance.toFixed(0)} ahead of pace`
              : `$${variance.toFixed(0)} under pace`}
          </Typography>
        )}

        <Typography variant={"caption"}>
          {spentPercent.toFixed(1)}% of budget used
        </Typography>
      </Stack>
    </Stack>
  )
}

export default BudgetProgressBar
