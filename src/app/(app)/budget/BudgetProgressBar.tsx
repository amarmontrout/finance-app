import { Typography, LinearProgress, Stack } from "@mui/material"

type BudgetProgressBarProps = {
  label: string
  actual: number
  budget: number
}

const BudgetProgressBar = ({
  label,
  actual,
  budget,
}: BudgetProgressBarProps) => {
  const percentage = budget === 0 ? 0 : (actual / budget) * 100

  const getColor = () => {
    if (percentage < 75) return "success"
    if (percentage < 100) return "warning"
    return "error"
  }

  return (
    <Stack spacing={0.5}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography variant={"h6"} fontWeight={700}>
          {label}
        </Typography>
        <Typography>
          ${actual.toFixed(2)} / ${budget.toFixed(2)}
        </Typography>
      </Stack>

      <LinearProgress
        variant={"determinate"}
        value={Math.min(percentage, 100)}
        color={getColor()}
        sx={{
          height: 10,
          borderRadius: 5,
        }}
      />

      <Typography
        variant={"caption"}
        color={"text.secondary"}
        textAlign={"right"}
      >
        {percentage.toFixed(1)}% used
      </Typography>
    </Stack>
  )
}

export default BudgetProgressBar
