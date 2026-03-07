import { DAYS, MONTHS } from "@/globals/globals"
import { Box, Card, Grid, IconButton, Stack, Typography } from "@mui/material"
import { useMemo, useRef, useState } from "react"
import { NavigateBefore, NavigateNext } from "@mui/icons-material"

const Calendar = ({
  currentMonth,
  currentDay,
  currentYear,
}: {
  currentMonth: string
  currentDay: number
  currentYear: number
}) => {
  const clickLock = useRef(false)

  const currentMonthIndex = MONTHS.indexOf(currentMonth)
  const [date, setDate] = useState(new Date(currentYear, currentMonthIndex, 1))

  const monthIndex = date.getMonth()
  const year = date.getFullYear()
  const todayColor = "#2C4D7A"
  const otherDaysColor = "#336699"

  const resetDate = () => {
    setDate(new Date(currentYear, currentMonthIndex, 1))
  }

  const prevMonth = () => {
    if (clickLock.current) return
    clickLock.current = true
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))
    setTimeout(() => {
      clickLock.current = false
    }, 100)
  }

  const nextMonth = () => {
    if (clickLock.current) return
    clickLock.current = true
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))
    setTimeout(() => {
      clickLock.current = false
    }, 100)
  }

  const days = useMemo(() => {
    const firstDay = new Date(year, monthIndex, 1)
    const firstWeekday = firstDay.getDay()
    const totalDays = new Date(year, monthIndex + 1, 0).getDate()
    const prevMonthDays = new Date(year, monthIndex, 0).getDate()

    const grid = []

    for (let i = 0; i < 42; i++) {
      let day = i - firstWeekday + 1
      let monthOffset = 0
      if (day <= 0) {
        day += prevMonthDays
        monthOffset = -1
      } else if (day > totalDays) {
        day -= totalDays
        monthOffset = 1
      }
      grid.push({ day, monthOffset, isCurrentMonth: monthOffset === 0 })
    }

    return grid
  }, [date])

  return (
    <Card
      style={{
        width: "100%",
        height: "100%",
        margin: "0 auto",
        borderRadius: "15px",
      }}
    >
      {/* Calendar Header */}
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        padding={"0.5rem 1rem"}
        alignItems={"center"}
      >
        <IconButton onClick={prevMonth}>
          <NavigateBefore />
        </IconButton>

        <Typography variant={"h6"} onClick={resetDate} fontSize={"4vw"}>
          {MONTHS[monthIndex]} {year}
        </Typography>

        <IconButton onClick={nextMonth}>
          <NavigateNext />
        </IconButton>
      </Stack>

      {/* Days of the Week */}
      <Grid
        container
        columns={7}
        paddingBottom={"5px"}
        borderBottom={"1px solid black"}
      >
        {DAYS.map((day, index) => {
          return (
            <Grid key={index} size={1}>
              <Box
                textAlign={"center"}
                alignContent={"center"}
                fontSize={"2vw"}
              >
                {day}
              </Box>
            </Grid>
          )
        })}
      </Grid>

      {/* Days Grid */}
      <Grid container columns={7}>
        {days.map((d, i) => {
          const isCurrentMonth = d.isCurrentMonth
          const isLastRow = Math.floor(i / 7) === 5
          const isLastCol = i % 7 === 6
          const isToday =
            d.day === currentDay &&
            isCurrentMonth &&
            monthIndex === currentMonthIndex &&
            year === currentYear

          return (
            <Grid key={i} size={1}>
              <Box
                height={"12vw"}
                minHeight={"70px"}
                padding={"1vw"}
                bgcolor={
                  isToday
                    ? todayColor
                    : isCurrentMonth
                      ? otherDaysColor
                      : "transparent"
                }
                color={isToday ? "#FFF" : isCurrentMonth ? "#FFF" : "darkgray"}
                borderRight={isLastCol ? "none" : "1px solid black"}
                borderBottom={isLastRow ? "none" : "1px solid black"}
              >
                <Box textAlign={"right"} lineHeight={"2vw"} fontSize={"2vw"}>
                  {d.day}
                </Box>
              </Box>
            </Grid>
          )
        })}
      </Grid>
    </Card>
  )
}

export default Calendar
