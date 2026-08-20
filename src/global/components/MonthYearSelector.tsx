import { HookSetter } from "@/types/types"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import FirstPageIcon from "@mui/icons-material/FirstPage"
import LastPageIcon from "@mui/icons-material/LastPage"
import { IconButton, Stack, Typography } from "@mui/material"
import { useRef } from "react"

const MonthYearSelector = ({
  selectedDate,
  setSelectedDate,
  resetSelectedDate,
  showMonth,
}: {
  selectedDate: Date
  setSelectedDate: HookSetter<Date>
  resetSelectedDate: () => void
  showMonth: boolean
}) => {
  const clickLock = useRef(false)

  const [month, year] = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  })
    .format(selectedDate)
    .split(" ")

  const updateDate = (months = 0, years = 0) => {
    if (clickLock.current) return
    clickLock.current = true

    setSelectedDate((prev: Date) => {
      const newDate = new Date(prev)

      if (months) newDate.setMonth(newDate.getMonth() + months)
      if (years) newDate.setFullYear(newDate.getFullYear() + years)

      return newDate
    })

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
        <IconButton onClick={() => updateDate(0, -1)}>
          <FirstPageIcon className="text-dark-4 dark:text-dark-6" />
        </IconButton>

        {showMonth && (
          <IconButton onClick={() => updateDate(-1)}>
            <ChevronLeftIcon className="text-dark-4 dark:text-dark-6" />
          </IconButton>
        )}
      </Stack>

      <Typography onClick={resetSelectedDate}>
        {showMonth && month} {year}
      </Typography>

      <Stack direction={"row"} spacing={1}>
        {showMonth && (
          <IconButton onClick={() => updateDate(1)}>
            <ChevronRightIcon className="text-dark-4 dark:text-dark-6" />
          </IconButton>
        )}

        <IconButton onClick={() => updateDate(0, 1)}>
          <LastPageIcon className="text-dark-4 dark:text-dark-6" />
        </IconButton>
      </Stack>
    </Stack>
  )
}

export default MonthYearSelector
