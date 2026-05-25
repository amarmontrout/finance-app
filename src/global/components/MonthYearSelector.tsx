import { HookSetter, SelectedDateType } from "@/types/types"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import FirstPageIcon from "@mui/icons-material/FirstPage"
import LastPageIcon from "@mui/icons-material/LastPage"
import { IconButton, Stack, Typography } from "@mui/material"
import { useRef } from "react"
import { MONTHS } from "../objects"

const MonthYearSelector = ({
  selectedDate,
  setSelectedDate,
  resetSelectedDate,
  showMonth,
}: {
  selectedDate: SelectedDateType
  setSelectedDate: HookSetter<SelectedDateType>
  resetSelectedDate: () => void
  showMonth: boolean
}) => {
  const clickLock = useRef(false)

  const handlePrevMonth = () => {
    if (clickLock.current) return
    clickLock.current = true

    setSelectedDate(({ month, year }) => {
      const index = MONTHS.indexOf(month)
      const newDate =
        index === 0
          ? { month: MONTHS[11], year: year - 1 }
          : { month: MONTHS[index - 1], year }
      return newDate
    })

    setTimeout(() => {
      clickLock.current = false
    }, 100)
  }

  const handlePrevYear = () => {
    if (clickLock.current) return
    clickLock.current = true

    setSelectedDate((prev) => ({
      ...prev,
      year: selectedDate.year - 1,
    }))

    setTimeout(() => {
      clickLock.current = false
    }, 100)
  }

  const handleNextMonth = () => {
    if (clickLock.current) return
    clickLock.current = true

    setSelectedDate(({ month, year }) => {
      const index = MONTHS.indexOf(month)
      const newDate =
        index === 11
          ? { month: MONTHS[0], year: year + 1 }
          : { month: MONTHS[index + 1], year }
      return newDate
    })

    setTimeout(() => {
      clickLock.current = false
    }, 100)
  }

  const handleNextYear = () => {
    if (clickLock.current) return
    clickLock.current = true

    setSelectedDate((prev) => ({
      ...prev,
      year: selectedDate.year + 1,
    }))

    setTimeout(() => {
      clickLock.current = false
    }, 100)
  }

  return (
    <Stack
      className="w-full md:w-[75%] xl:w-[50%] 2xl:w-[40%]"
      direction={"row"}
      sx={{
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Stack direction={"row"} spacing={1}>
        <IconButton onClick={handlePrevYear}>
          <FirstPageIcon className="text-dark-4 dark:text-dark-6" />
        </IconButton>

        {showMonth && (
          <IconButton onClick={handlePrevMonth}>
            <ChevronLeftIcon className="text-dark-4 dark:text-dark-6" />
          </IconButton>
        )}
      </Stack>

      <Typography onClick={resetSelectedDate}>
        {showMonth && selectedDate.month} {selectedDate.year}
      </Typography>

      <Stack direction={"row"} spacing={1}>
        {showMonth && (
          <IconButton onClick={handleNextMonth}>
            <ChevronRightIcon className="text-dark-4 dark:text-dark-6" />
          </IconButton>
        )}

        <IconButton onClick={handleNextYear}>
          <LastPageIcon className="text-dark-4 dark:text-dark-6" />
        </IconButton>
      </Stack>
    </Stack>
  )
}

export default MonthYearSelector
