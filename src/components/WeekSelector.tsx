import { Stack, IconButton, Typography } from "@mui/material"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { HookSetter, WeekType } from "@/utils/type"
import { useRef } from "react"

const WeekSelector = ({
  week,
  weekOffset,
  setWeekOffset,
}: {
  week: WeekType
  weekOffset: number
  setWeekOffset: HookSetter<number>
}) => {
  const clickLock = useRef(false)

  const handlePrevWeek = () => {
    if (clickLock.current) return
    clickLock.current = true

    setWeekOffset((offset) => {
      return offset - 1
    })

    setTimeout(() => {
      clickLock.current = false
    }, 100)
  }

  const handleNextWeek = () => {
    if (clickLock.current) return
    clickLock.current = true

    setWeekOffset((offset) => {
      return offset + 1
    })

    setTimeout(() => {
      clickLock.current = false
    }, 100)
  }

  const handleResetWeek = () => {
    setWeekOffset(0)
  }

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
      <IconButton onClick={handlePrevWeek}>
        <ChevronLeftIcon />
      </IconButton>

      <Typography onClick={handleResetWeek}>
        {currentWeek.start} - {currentWeek.end}
      </Typography>

      <IconButton onClick={handleNextWeek} disabled={weekOffset === 0}>
        <ChevronRightIcon />
      </IconButton>
    </Stack>
  )
}

export default WeekSelector
