import { Stack, IconButton, Typography } from "@mui/material"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { HookSetter, WeekType } from "@/utils/type"

const WeekSelector = ({
  week,
  weekOffset,
  setWeekOffset,
}: {
  week: WeekType
  weekOffset: number
  setWeekOffset: HookSetter<number>
}) => {
  const currentWeek = {
    start: `${week.start.month} ${week.start.day}, ${week.start.year}`,
    end: `${week.end.month} ${week.end.day}, ${week.end.year}`,
  }
  return (
    <Stack
      className="w-full md:w-[75%] xl:w-[50%] 2xl:w-[40%]"
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      margin={"0 auto"}
    >
      <IconButton onClick={() => setWeekOffset((w) => w - 1)}>
        <ChevronLeftIcon />
      </IconButton>

      <Typography onClick={() => setWeekOffset(0)}>
        {currentWeek.start} - {currentWeek.end}
      </Typography>

      <IconButton
        onClick={() => setWeekOffset((w) => w + 1)}
        disabled={weekOffset === 0}
      >
        <ChevronRightIcon />
      </IconButton>
    </Stack>
  )
}

export default WeekSelector
