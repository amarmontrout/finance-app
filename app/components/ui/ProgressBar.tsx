import {
  ACCENT_COLOR,
  NEGATIVE_COLOR,
  POSITIVE_COLOR,
  TEXT_COLOR,
} from "@/app/data/colors"
import { currencyFormatter } from "@/app/lib/functions/formatters"
import EditIcon from "@mui/icons-material/Edit"
import {
  Box,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material"
import { useMemo } from "react"

const ProgressBar = ({
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
  const spentPercent = budget === 0 ? 0 : Math.min((actual / budget) * 100, 100)

  const { expectedPercent, isOverPace, variance } = useMemo(() => {
    if (!expected) {
      return { expectedPercent: 0, isOverPace: false, variance: 0 }
    }
    const safeTotal = Math.max(budget, 1)
    return {
      expectedPercent: Math.min((expected / safeTotal) * 100, 100),
      isOverPace: actual > expected,
      variance: currencyFormatter.format(Math.abs(actual - expected)),
    }
  }, [actual, expected])

  const getBarColor = () => {
    if (spentPercent < 75) return POSITIVE_COLOR
    if (spentPercent < 100) return ACCENT_COLOR
    return NEGATIVE_COLOR
  }

  return (
    <Stack spacing={0.5} sx={{ minHeight: 55, width: "100%" }}>
      <Stack
        direction={"row"}
        sx={{ justifyContent: "space-between", alignItems: "flex-end" }}
      >
        <Stack direction={"row"} spacing={1} sx={{ alignItems: "center" }}>
          <Typography
            variant={"h6"}
            sx={{ alignSelf: "flex-end", lineHeight: 1 }}
          >
            {label}
          </Typography>

          {onEdit && (
            <IconButton
              sx={{ width: "20px", height: "20px" }}
              disableRipple
              onClick={onEdit}
            >
              <EditIcon sx={{ fontSize: "20px", color: TEXT_COLOR }} />
            </IconButton>
          )}
        </Stack>

        <Typography
          variant={"caption"}
          sx={{ alignSelf: "flex-end", lineHeight: 1 }}
        >
          {`${currencyFormatter.format(actual)} / 
            ${currencyFormatter.format(budget)}`}
        </Typography>
      </Stack>

      <Box sx={{ position: "relative" }}>
        <LinearProgress
          variant={"determinate"}
          value={spentPercent}
          sx={{
            height: 15,
            borderRadius: 0.5,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            "& .MuiLinearProgress-bar": { backgroundColor: getBarColor() },
          }}
        />

        {expected && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: `${expectedPercent}%`,
              transform: "translateX(-50%)",
              width: "1px",
              height: 15,
              bgcolor: "text.primary",
              pointerEvents: "none",
            }}
          />
        )}
      </Box>

      <Stack
        direction={"row"}
        sx={{ justifyContent: expected ? "space-between" : "flex-end" }}
      >
        {expected && (
          <Typography
            variant={"caption"}
            sx={{ alignSelf: "flex-start", lineHeight: 1 }}
          >
            {isOverPace
              ? `${variance} over expected`
              : `${variance} behind expected`}
          </Typography>
        )}
      </Stack>
    </Stack>
  )
}

export default ProgressBar
