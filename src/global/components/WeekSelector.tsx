import { HookSetter, WeekType } from "@/types/types"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { IconButton, Stack, Typography } from "@mui/material"
import { useRef } from "react"
import { timestampToDateString } from "../formattingFunctions"

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

  return (
    <Stack
      className="w-full md:w-[75%] xl:w-[50%] 2xl:w-[40%]"
      direction={"row"}
      sx={{
        alignItems: "center",
        justifyContent: "space-between",
        margin: "0 auto",
      }}
    >
      <IconButton onClick={handlePrevWeek}>
        <ChevronLeftIcon />
      </IconButton>

      <Typography onClick={handleResetWeek}>
        {timestampToDateString(week.start)} - {timestampToDateString(week.end)}
      </Typography>

      <IconButton onClick={handleNextWeek} disabled={weekOffset === 0}>
        <ChevronRightIcon />
      </IconButton>
    </Stack>
  )
}

export default WeekSelector
