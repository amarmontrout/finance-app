import { useTransactionContext } from "@/app/contexts/transaction-context"
import { TEXT_COLOR } from "@/app/data/colors"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import FirstPageIcon from "@mui/icons-material/FirstPage"
import LastPageIcon from "@mui/icons-material/LastPage"
import { IconButton, Stack, Typography } from "@mui/material"
import { useRef } from "react"

const MonthYearSelector = ({
  showMonth,
  showYearButtons,
}: {
  showMonth: boolean
  showYearButtons: boolean
}) => {
  const { selectedDate, setSelectedDate } = useTransactionContext()
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
    setTimeout(() => (clickLock.current = false), 100)
  }

  return (
    <Stack
      direction={"row"}
      sx={{ alignItems: "center", justifyContent: "space-between" }}
    >
      <Stack direction={"row"} spacing={1}>
        {showYearButtons && (
          <IconButton onClick={() => updateDate(0, -1)} disableRipple>
            <FirstPageIcon sx={{ color: TEXT_COLOR }} />
          </IconButton>
        )}

        {showMonth && (
          <IconButton onClick={() => updateDate(-1)} disableRipple>
            <ChevronLeftIcon sx={{ color: TEXT_COLOR }} />
          </IconButton>
        )}
      </Stack>

      <Typography onClick={() => setSelectedDate(new Date())}>
        {showMonth && month} {year}
      </Typography>

      <Stack direction={"row"} spacing={1}>
        {showMonth && (
          <IconButton onClick={() => updateDate(1)} disableRipple>
            <ChevronRightIcon sx={{ color: TEXT_COLOR }} />
          </IconButton>
        )}

        {showYearButtons && (
          <IconButton onClick={() => updateDate(0, 1)} disableRipple>
            <LastPageIcon sx={{ color: TEXT_COLOR }} />
          </IconButton>
        )}
      </Stack>
    </Stack>
  )
}

export default MonthYearSelector
