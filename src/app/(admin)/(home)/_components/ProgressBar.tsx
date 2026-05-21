import EditIcon from "@mui/icons-material/Edit";
import { IconButton, LinearProgress, Stack, Typography } from "@mui/material";

type ProgressBarProps = {
  label: string;
  actual: number;
  budget: number;
  onEdit?: () => void;
};

const BudgetProgressBar = ({
  label,
  actual,
  budget,
  onEdit,
}: ProgressBarProps) => {
  const percentage = budget === 0 ? 0 : (actual / budget) * 100;

  const getColor = () => {
    if (percentage < 75) return "success";
    if (percentage < 100) return "warning";
    return "error";
  };

  return (
    <Stack spacing={0.5}>
      <Stack
        direction={"row"}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
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
        sx={{
          textAlign: "right",
        }}
      >
        {percentage.toFixed(1)}% used
      </Typography>
    </Stack>
  );
};

export default BudgetProgressBar;
