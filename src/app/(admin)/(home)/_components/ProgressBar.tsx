import { currencyFormatter } from "@/global/formattingFunctions"
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
    if (spentPercent < 75) return "#7FB685"
    if (spentPercent < 100) return "#C9A86A"
    return "#B85C5C"
  }

  return (
    <Stack spacing={0.5} minHeight={"55px"}>
      <Stack
        direction={"row"}
        sx={{
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
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
              className="text-dark-4 dark:text-dark-6"
              sx={{ width: "20px", height: "20px" }}
              disableRipple
              onClick={onEdit}
            >
              <EditIcon sx={{ fontSize: "20px" }} />
            </IconButton>
          )}
        </Stack>

        <Typography
          variant="caption"
          sx={{ alignSelf: "flex-end", lineHeight: 1 }}
        >
          {currencyFormatter.format(actual)} /{" "}
          {currencyFormatter.format(budget)}
        </Typography>
      </Stack>

      <Box position="relative">
        <LinearProgress
          variant={"determinate"}
          value={spentPercent}
          sx={{
            height: 15,
            borderRadius: 1,
            backgroundColor: "rgba(255,255,255,0.15)",
            "& .MuiLinearProgress-bar": {
              backgroundColor: getBarColor(),
            },
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
        justifyContent={expected ? "space-between" : "flex-end"}
      >
        {expected && (
          <Typography
            variant={"caption"}
            sx={{ alignSelf: "flex-start", lineHeight: 1 }}
          >
            {isOverPace
              ? `$${variance.toFixed(0)} over expected`
              : `$${variance.toFixed(0)} behind expected`}
          </Typography>
        )}
      </Stack>
    </Stack>
  )
}

export default BudgetProgressBar
